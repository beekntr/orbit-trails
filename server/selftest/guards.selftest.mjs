/**
 * Unit tests for server/guards.mjs. No database, no network.
 *   npm run test:server
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  clientIp,
  createRateLimiter,
  escapeHtml,
  escapeMultiline,
  resolveJwtSecret,
  validateContact,
  validateCustomTour,
  validationError,
} from '../guards.mjs';

const fields = (result) => result.errors.map((error) => error.field);

// ------------------------------------------------------------------ escaping

test('escapeHtml neutralises markup and handles non-strings', () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">&`),
    '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;',
  );
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(12), '12');
});

test('escapeMultiline keeps line breaks but not tags', () => {
  assert.equal(escapeMultiline('line one\n<b>two</b>\r\nthree'), 'line one<br>&lt;b&gt;two&lt;/b&gt;<br>three');
});

// ---------------------------------------------------------------- contact

test('validateContact accepts a normal message and trims it', () => {
  const result = validateContact({ name: '  Asha Rao ', email: 'asha@example.com', message: ' Hello there ' });
  assert.deepEqual(result, { ok: true, value: { name: 'Asha Rao', email: 'asha@example.com', message: 'Hello there' } });
});

test('validateContact keeps only whitelisted fields', () => {
  const result = validateContact({
    name: 'A',
    email: 'a@example.com',
    message: 'Hi',
    phone: '+44 7450 164575',
    source: 'lead-magnet',
    status: 'resolved',
    _id: '000000000000000000000000',
    createdAt: '2000-01-01',
    isAdmin: true,
  });
  assert.equal(result.ok, true);
  assert.deepEqual(Object.keys(result.value).sort(), ['email', 'message', 'name', 'phone', 'source']);
});

test('validateContact reports each missing or invalid field', () => {
  assert.deepEqual(fields(validateContact({})), ['name', 'email', 'message']);
  assert.deepEqual(fields(validateContact(null)), ['name', 'email', 'message']);
  assert.deepEqual(fields(validateContact('a string body')), ['name', 'email', 'message']);
  assert.deepEqual(fields(validateContact({ name: 'A', email: 'not-an-email', message: 'Hi' })), ['email']);
  assert.deepEqual(fields(validateContact({ name: 'A', email: 'a@example.com', message: 'Hi', phone: 'call me maybe' })), ['phone']);
});

test('validateContact rejects objects and arrays (query-operator payloads)', () => {
  const result = validateContact({ name: { $gt: '' }, email: ['a@example.com'], message: { toString: 'x' } });
  assert.deepEqual(fields(result), ['name', 'email', 'message']);
});

test('validateContact rejects mail-header tricks in the address', () => {
  for (const email of ['a@example.com\nBcc: x@evil.test', 'a@example.com, b@evil.test', 'Name <a@example.com>']) {
    assert.deepEqual(fields(validateContact({ name: 'A', email, message: 'Hi' })), ['email'], email);
  }
});

test('validateContact enforces length limits and strips control characters', () => {
  assert.deepEqual(fields(validateContact({ name: 'x'.repeat(101), email: 'a@example.com', message: 'Hi' })), ['name']);
  assert.deepEqual(fields(validateContact({ name: 'A', email: 'a@example.com', message: 'x'.repeat(5001) })), ['message']);
  const result = validateContact({ name: 'A\u0000B', email: 'a@example.com', message: 'Hi\u0007' });
  assert.deepEqual(result.value, { name: 'AB', email: 'a@example.com', message: 'Hi' });
});

// ------------------------------------------------------------- custom tour

/** Exactly what client/components/planner/TripPlanner.tsx sends. */
const plannerPayload = {
  startDate: '2027-02-01T00:00:00.000Z',
  duration: 12,
  numberOfTravelers: 4,
  accommodationType: 'Luxury',
  destinations: ['Heritage & Palaces', 'Wildlife & Safaris'],
  budgetRange: '£3,400 per person (GBP)',
  comments: 'Trip planner enquiry | Travel style: Heritage & Palaces | Notes: anniversary',
  name: 'Emma Clarke',
  email: 'emma@example.co.uk',
  phone: '7450 164575',
  countryCode: '+44',
  source: 'trip-planner',
  travelCrew: 'Family',
  travelStyles: ['Heritage & Palaces', 'Wildlife & Safaris'],
  countryOfResidence: 'United Kingdom',
  currency: 'GBP',
  budgetPerPerson: 3400,
  preferredMonth: '2027-02',
  interestedTour: 'Land Of Kings',
  pageUrl: '/plan-my-trip',
};

test('validateCustomTour accepts the trip planner payload unchanged', () => {
  const result = validateCustomTour(plannerPayload);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.deepEqual(result.value, plannerPayload);
});

test('validateCustomTour accepts the older customise form and numeric strings', () => {
  const result = validateCustomTour({
    startDate: '2027-01-15T00:00:00.000Z',
    duration: '7',
    numberOfTravelers: '2',
    accommodationType: 'Comfort',
    destinations: ['Golden Triangle & Rajasthan'],
    budgetRange: '$1000–2000',
    comments: '',
    name: 'Sam',
    email: 'sam@example.com',
    phone: '5551234567',
    countryCode: '+1',
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.value.duration, 7);
  assert.equal(result.value.numberOfTravelers, 2);
  assert.equal('comments' in result.value, false);
});

test('validateCustomTour drops fields a visitor must not control', () => {
  const result = validateCustomTour({ ...plannerPayload, status: 'booked', _id: 'abc', updatedAt: 'x', role: 'admin' });
  assert.equal(result.ok, true);
  for (const field of ['status', '_id', 'updatedAt', 'role']) {
    assert.equal(field in result.value, false, field);
  }
});

test('validateCustomTour rejects out-of-range and wrongly typed values', () => {
  const bad = (patch) => fields(validateCustomTour({ ...plannerPayload, ...patch }));
  assert.deepEqual(bad({ duration: 0 }), ['duration']);
  assert.deepEqual(bad({ duration: 1e9 }), ['duration']);
  assert.deepEqual(bad({ duration: 'a week' }), ['duration']);
  assert.deepEqual(bad({ duration: 2.5 }), ['duration']);
  assert.deepEqual(bad({ numberOfTravelers: 500 }), ['numberOfTravelers']);
  assert.deepEqual(bad({ accommodationType: 'Penthouse' }), ['accommodationType']);
  assert.deepEqual(bad({ destinations: 'Jaipur' }), ['destinations']);
  assert.deepEqual(bad({ destinations: [{ $ne: 1 }] }), ['destinations']);
  assert.deepEqual(bad({ destinations: Array(21).fill('x') }), ['destinations']);
  assert.deepEqual(bad({ comments: 'x'.repeat(2001) }), ['comments']);
  assert.deepEqual(bad({ countryCode: '44' }), ['countryCode']);
  assert.deepEqual(bad({ currency: 'pounds' }), ['currency']);
  assert.deepEqual(bad({ startDate: 'whenever' }), ['startDate']);
  assert.deepEqual(bad({ pageUrl: 'https://evil.test/' }), ['pageUrl']);
  assert.deepEqual(bad({ name: undefined, email: 'nope' }), ['name', 'email']);
});

test('validationError uses the first problem as the message', () => {
  const result = validateContact({ name: 'A', email: 'bad', message: 'Hi' });
  assert.deepEqual(validationError(result.errors), {
    success: false,
    message: 'Please enter a valid email address.',
    errors: [{ field: 'email', message: 'Please enter a valid email address.' }],
  });
});

// ------------------------------------------------------------ rate limiting

/** Minimal stand-ins for Express req/res. */
function call(limiter, ip) {
  const outcome = { status: 200, headers: {}, body: undefined, passed: false };
  const req = { headers: ip ? { 'cf-connecting-ip': ip } : {}, ip: '10.0.0.1' };
  const res = {
    set(name, value) { outcome.headers[name] = value; return res; },
    status(code) { outcome.status = code; return res; },
    json(body) { outcome.body = body; return res; },
  };
  limiter(req, res, () => { outcome.passed = true; });
  return outcome;
}

test('clientIp prefers the Cloudflare header and falls back to the socket', () => {
  assert.equal(clientIp({ headers: { 'cf-connecting-ip': '203.0.113.9' }, ip: '10.0.0.1' }), '203.0.113.9');
  assert.equal(clientIp({ headers: {}, ip: '10.0.0.1' }), '10.0.0.1');
  assert.equal(clientIp({ headers: {}, socket: { remoteAddress: '10.0.0.2' } }), '10.0.0.2');
  assert.equal(clientIp({ headers: {} }), 'unknown');
});

test('rate limiter allows `max` requests per IP, then answers 429 until the window ends', () => {
  let time = 1_000_000;
  const limiter = createRateLimiter({ windowMs: 60_000, max: 3, message: 'Slow down', now: () => time });

  for (let i = 0; i < 3; i++) assert.equal(call(limiter, '203.0.113.1').passed, true);

  const blocked = call(limiter, '203.0.113.1');
  assert.equal(blocked.passed, false);
  assert.equal(blocked.status, 429);
  assert.deepEqual(blocked.body, { success: false, message: 'Slow down' });
  assert.equal(blocked.headers['Retry-After'], '60');

  // Another visitor is unaffected.
  assert.equal(call(limiter, '203.0.113.2').passed, true);

  // Half-way through the window: still blocked, with a shorter wait advertised.
  time += 30_000;
  assert.equal(call(limiter, '203.0.113.1').headers['Retry-After'], '30');

  // After the window: allowed again.
  time += 30_001;
  assert.equal(call(limiter, '203.0.113.1').passed, true);
});

test('rate limiter stays bounded when flooded with distinct addresses', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1, maxTrackedIps: 50 });
  for (let i = 0; i < 500; i++) assert.equal(call(limiter, `198.51.100.${i}`).passed, true);
});

// --------------------------------------------------------------- JWT secret

test('resolveJwtSecret uses the configured secret', () => {
  assert.equal(resolveJwtSecret({ JWT_SECRET: 'a-long-configured-secret', NODE_ENV: 'production' }), 'a-long-configured-secret');
});

test('resolveJwtSecret refuses to start production without a real secret', () => {
  assert.throws(() => resolveJwtSecret({ NODE_ENV: 'production' }), /JWT_SECRET is not set/);
  assert.throws(
    () => resolveJwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'orbit-trails-secret-key' }),
    /old default value/,
  );
});

test('resolveJwtSecret never falls back to a known value outside production', () => {
  const warnings = [];
  const log = { warn: (message) => warnings.push(message) };
  const first = resolveJwtSecret({}, log);
  const second = resolveJwtSecret({ JWT_SECRET: 'orbit-trails-secret-key' }, log);
  assert.match(first, /^[0-9a-f]{96}$/);
  assert.match(second, /^[0-9a-f]{96}$/);
  assert.notEqual(first, second);
  assert.equal(warnings.length, 2);
});
