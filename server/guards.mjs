/**
 * Guards for the public endpoints of api-server.mjs: input validation, rate
 * limiting, HTML escaping for notification emails, and JWT secret handling.
 *
 * Everything here is a pure function or plain Express middleware. Nothing
 * touches the database, and nothing reads the environment at import time, so
 * the module can be tested on its own:
 *
 *   npm run test:server
 */
import crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// Output escaping
// ---------------------------------------------------------------------------

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Make a user-supplied value safe to place inside HTML (notification emails). */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/** Escaped text with line breaks preserved, for multi-line fields such as messages. */
export function escapeMultiline(value) {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

/**
 * The visitor's IP address. The API sits behind Cloudflare, which puts the real
 * address in CF-Connecting-IP; without that header we fall back to the socket.
 *
 * This trusts the header. If the origin can be reached directly (bypassing
 * Cloudflare), restrict it to Cloudflare's IP ranges at the firewall, or a
 * caller could send a different fake address with every request.
 */
export function clientIp(req) {
  const header = req.headers?.['cf-connecting-ip'];
  const fromCloudflare = Array.isArray(header) ? header[0] : header;
  return (
    (typeof fromCloudflare === 'string' && fromCloudflare.trim()) ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Fixed-window, per-IP rate limiter kept in memory (one PM2 process, so no
 * shared store is needed). Requests over the limit get a 429 in the API's
 * usual `{ success, message }` shape plus a Retry-After header.
 */
export function createRateLimiter({ windowMs, max, message, maxTrackedIps = 20000, now = Date.now }) {
  const windows = new Map(); // ip -> { count, resetAt }

  const dropExpired = () => {
    const time = now();
    for (const [ip, entry] of windows) {
      if (entry.resetAt <= time) windows.delete(ip);
    }
  };

  // Periodic clean-up so the map cannot grow for ever. unref(): never keeps the process alive.
  setInterval(dropExpired, windowMs).unref?.();

  return function rateLimit(req, res, next) {
    const time = now();
    const ip = clientIp(req);
    let entry = windows.get(ip);

    if (!entry || entry.resetAt <= time) {
      if (windows.size >= maxTrackedIps) {
        dropExpired();
        // Still full of live entries: start over rather than exhaust memory.
        if (windows.size >= maxTrackedIps) windows.clear();
      }
      entry = { count: 0, resetAt: time + windowMs };
      windows.set(ip, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.resetAt - time) / 1000))));
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please try again later.',
      });
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

// Deliberately conservative: no spaces, quotes, commas or angle brackets, which
// also rules out header tricks when the address is used as a mail recipient.
const EMAIL_PATTERN = /^[^\s@<>"',;:\\()[\]]+@[^\s@<>"',;:\\()[\]]+\.[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^[+\d(][\d\s().\-/]{4,}$/;
// Control characters other than tab, newline and carriage return.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const isMissing = (value) => value === undefined || value === null || value === '';

/** Collects cleaned values and errors for one request body. */
function createValidator(body) {
  const source = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const value = {};
  const errors = [];
  const fail = (field, message) => errors.push({ field, message });

  return {
    value,
    errors,

    /** A string field. Objects and arrays are rejected, which also blocks query-operator payloads. */
    text(field, label, { required = false, max, pattern, patternMessage } = {}) {
      const raw = source[field];
      if (isMissing(raw)) {
        if (required) fail(field, `${label} is required.`);
        return;
      }
      if (typeof raw !== 'string') return fail(field, `${label} must be text.`);
      const cleaned = raw.replace(CONTROL_CHARS, '').trim();
      if (!cleaned) {
        if (required) fail(field, `${label} is required.`);
        return;
      }
      if (cleaned.length > max) return fail(field, `${label} must be ${max} characters or fewer.`);
      if (pattern && !pattern.test(cleaned)) return fail(field, patternMessage || `${label} is not valid.`);
      value[field] = cleaned;
    },

    /** A whole number, sent as a number or a numeric string. */
    integer(field, label, { required = false, min, max } = {}) {
      const raw = source[field];
      if (isMissing(raw)) {
        if (required) fail(field, `${label} is required.`);
        return;
      }
      const number = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw.trim()) : NaN;
      if (!Number.isInteger(number) || number < min || number > max) {
        return fail(field, `${label} must be a whole number between ${min} and ${max}.`);
      }
      value[field] = number;
    },

    /** A list of short strings. Empty entries are dropped. */
    textList(field, label, { maxItems, maxLength }) {
      const raw = source[field];
      if (isMissing(raw)) return;
      if (!Array.isArray(raw) || raw.some((item) => typeof item !== 'string')) {
        return fail(field, `${label} must be a list of text values.`);
      }
      const cleaned = raw.map((item) => item.replace(CONTROL_CHARS, '').trim()).filter(Boolean);
      if (cleaned.length > maxItems) return fail(field, `${label} can have at most ${maxItems} entries.`);
      if (cleaned.some((item) => item.length > maxLength)) {
        return fail(field, `Each entry in ${label.toLowerCase()} must be ${maxLength} characters or fewer.`);
      }
      value[field] = cleaned;
    },

    result() {
      return errors.length ? { ok: false, errors } : { ok: true, value };
    },
  };
}

const emailRule = { required: true, max: 254, pattern: EMAIL_PATTERN, patternMessage: 'Please enter a valid email address.' };
const phoneRule = { max: 30, pattern: PHONE_PATTERN, patternMessage: 'Please enter a valid phone number.' };

/**
 * POST /api/contact
 * Returns { ok: true, value } with only the accepted fields, or { ok: false, errors }.
 */
export function validateContact(body) {
  const v = createValidator(body);
  v.text('name', 'Name', { required: true, max: 100 });
  v.text('email', 'Email', emailRule);
  v.text('phone', 'Phone number', phoneRule);
  v.text('message', 'Message', { required: true, max: 5000 });
  v.text('source', 'Source', { max: 50 });
  return v.result();
}

/**
 * POST /api/customize-tour (the trip planner and the older customise form).
 * Returns { ok: true, value } with only the accepted fields, or { ok: false, errors }.
 */
export function validateCustomTour(body) {
  const v = createValidator(body);

  // Contact details
  v.text('name', 'Name', { required: true, max: 100 });
  v.text('email', 'Email', emailRule);
  v.text('phone', 'Phone number', phoneRule);
  v.text('countryCode', 'Country code', {
    max: 5,
    pattern: /^\+\d{1,4}$/,
    patternMessage: 'Country code must look like +44.',
  });

  // Trip details
  v.text('startDate', 'Start date', {
    max: 40,
    pattern: { test: (text) => !Number.isNaN(Date.parse(text)) },
    patternMessage: 'Start date is not a valid date.',
  });
  v.integer('duration', 'Duration', { min: 1, max: 365 });
  v.integer('numberOfTravelers', 'Number of travellers', { min: 1, max: 100 });
  v.text('accommodationType', 'Accommodation type', {
    max: 20,
    pattern: /^(Luxury|Comfort)$/,
    patternMessage: 'Accommodation type must be Luxury or Comfort.',
  });
  v.textList('destinations', 'Destinations', { maxItems: 20, maxLength: 100 });
  v.text('budgetRange', 'Budget range', { max: 100 });
  v.text('comments', 'Comments', { max: 2000 });

  // Lead attribution sent by the trip planner
  v.text('source', 'Source', { max: 50 });
  v.text('travelCrew', 'Travel crew', { max: 30 });
  v.textList('travelStyles', 'Travel styles', { maxItems: 20, maxLength: 100 });
  v.text('countryOfResidence', 'Country of residence', { max: 80 });
  v.text('currency', 'Currency', { max: 3, pattern: /^[A-Z]{3}$/, patternMessage: 'Currency must be a 3-letter code.' });
  v.integer('budgetPerPerson', 'Budget per person', { min: 0, max: 1000000 });
  v.text('preferredMonth', 'Preferred month', { max: 20 });
  v.text('interestedTour', 'Interested tour', { max: 150 });
  v.text('pageUrl', 'Page', { max: 300, pattern: /^\//, patternMessage: 'Page must be a site path.' });

  return v.result();
}

/** The 400 response body for a failed validation, in the API's usual shape. */
export function validationError(errors) {
  return { success: false, message: errors[0].message, errors };
}

// ---------------------------------------------------------------------------
// JWT secret
// ---------------------------------------------------------------------------

/** The value that used to be hardcoded as a fallback. It is in the repository, so it is not a secret. */
const LEGACY_DEFAULT_SECRET = 'orbit-trails-secret-key';

/**
 * Decide which secret signs admin tokens. A missing JWT_SECRET (or the old
 * published default) is never silently replaced by a known value:
 *  - in production the server refuses to start;
 *  - otherwise a random secret is generated for this run. Admin sessions then
 *    end whenever the server restarts, but nobody can forge a token.
 */
export function resolveJwtSecret(env = process.env, log = console) {
  const configured = typeof env.JWT_SECRET === 'string' ? env.JWT_SECRET.trim() : '';
  if (configured && configured !== LEGACY_DEFAULT_SECRET) return configured;

  const problem = configured
    ? 'JWT_SECRET is set to the old default value, which is public.'
    : 'JWT_SECRET is not set.';
  const fix = "Add JWT_SECRET to the server's .env, for example the output of: openssl rand -hex 48";

  if (env.NODE_ENV === 'production') {
    throw new Error(`${problem} Refusing to start in production. ${fix}`);
  }

  log.warn(
    `⚠️  ${problem} Using a random secret for this run: admin logins will stop working after every restart. ${fix}`,
  );
  return crypto.randomBytes(48).toString('hex');
}

let cachedSecret;

/** Resolved on first use (after dotenv has loaded) and then reused. */
export function getJwtSecret() {
  cachedSecret ??= resolveJwtSecret();
  return cachedSecret;
}
