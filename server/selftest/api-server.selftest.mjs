/**
 * End-to-end check of the real production server file (server/api-server.mjs)
 * with only MongoDB and the mail transport stubbed out (see stubs.mjs).
 * Starts the server as a child process on a spare local port and sends it real
 * HTTP requests. Nothing here touches the production API or database.
 *
 *   npm run test:server
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverFile = path.join(here, '..', 'api-server.mjs');
const stubsFile = path.join(here, 'stubs.mjs');
const PORT = 39217;
const BASE = `http://127.0.0.1:${PORT}`;
const captureFile = path.join(os.tmpdir(), `orbit-selftest-${process.pid}.json`);
const CONFIGURED_SECRET = 'selftest-secret-value-0123456789';
/** The fallback the server used to hardcode. It is in the repository history, so anyone can sign with it. */
const LEGACY_DEFAULT_SECRET = 'orbit-trails-secret-key';

function startServer(extraEnv) {
  const child = spawn(process.execPath, ['--import', stubsFile, serverFile], {
    cwd: os.tmpdir(), // no .env here, so the test controls the whole environment
    env: {
      PATH: process.env.PATH,
      PORT: String(PORT),
      MONGODB_URI: 'mongodb://stubbed.invalid/selftest',
      SELFTEST_CAPTURE_FILE: captureFile,
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => (output += chunk));
  child.stderr.on('data', (chunk) => (output += chunk));
  return { child, output: () => output };
}

const post = (route, body, ip, headers = {}) =>
  fetch(`${BASE}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const captured = () => JSON.parse(fs.readFileSync(captureFile, 'utf8'));

async function waitFor(check, label, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const value = await check();
      if (value) return value;
    } catch {
      // not ready yet
    }
    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${label}`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

let server;

before(async () => {
  server = startServer({ NODE_ENV: 'development', JWT_SECRET: CONFIGURED_SECRET });
  await waitFor(async () => (await fetch(`${BASE}/health`)).ok, 'the server to start').catch((error) => {
    throw new Error(`${error.message}\n${server.output()}`);
  });
});

after(() => {
  server?.child.kill();
  fs.rmSync(captureFile, { force: true });
});

const validContact = { name: 'Asha Rao', email: 'asha@example.com', message: 'Do you run tours in March?' };

test('contact: a valid message is saved with only whitelisted fields', async () => {
  const response = await post('/api/contact', { ...validContact, source: 'lead-magnet', status: 'resolved', isAdmin: true }, '203.0.113.10');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.email, 'asha@example.com');

  const saved = captured().saved.find((entry) => entry.model === 'Contact' && entry.doc.email === 'asha@example.com');
  assert.equal(saved.doc.source, 'lead-magnet');
  assert.equal(saved.doc.status, 'new', 'status must come from the schema default, not the visitor');
  assert.equal('isAdmin' in saved.doc, false);
});

test('contact: invalid input gets a 400 in the usual response shape', async () => {
  const response = await post('/api/contact', { name: 'A', email: 'nope', message: { $gt: '' } }, '203.0.113.11');
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(typeof body.message, 'string');
  assert.deepEqual(body.errors.map((error) => error.field), ['email', 'message']);
});

test('contact: markup in a message is escaped in both notification emails', async () => {
  const email = 'mallory@example.com';
  const response = await post(
    '/api/contact',
    { name: '<b>Mallory</b>', email, message: 'Hello<script>alert(1)</script>\n<a href="https://evil.test">click</a>' },
    '203.0.113.12',
  );
  assert.equal(response.status, 200);

  const mails = await waitFor(() => {
    const matching = captured().mail.filter((mail) => mail.html.includes('Mallory'));
    return matching.length === 2 && matching;
  }, 'both emails');

  for (const mail of mails) {
    assert.equal(mail.html.includes('<script>'), false, 'raw <script> reached an email');
    assert.equal(mail.html.includes('<a href="https://evil.test">'), false, 'raw link reached an email');
    assert.equal(mail.html.includes('<b>Mallory</b>'), false, 'raw markup in the name reached an email');
    assert.ok(mail.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(mail.html.includes('&lt;b&gt;Mallory&lt;/b&gt;'));
  }
  assert.ok(mails.some((mail) => mail.to === email), 'the auto-reply goes to the address given');
});

test('contact: the 7th request from one address inside the window is refused', async () => {
  const ip = '203.0.113.13';
  for (let i = 0; i < 6; i++) {
    assert.equal((await post('/api/contact', validContact, ip)).status, 200, `request ${i + 1}`);
  }
  const blocked = await post('/api/contact', validContact, ip);
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('retry-after')) > 0);
  assert.equal((await blocked.json()).success, false);

  // A different visitor is not affected.
  assert.equal((await post('/api/contact', validContact, '203.0.113.14')).status, 200);
});

test('customize-tour: the trip planner payload is accepted and stored', async () => {
  const payload = {
    startDate: '2027-02-01T00:00:00.000Z',
    duration: 12,
    numberOfTravelers: 4,
    accommodationType: 'Luxury',
    destinations: ['Heritage & Palaces'],
    budgetRange: '£3,400 per person (GBP)',
    comments: 'Trip planner enquiry | Notes: <i>anniversary</i>',
    name: 'Emma Clarke',
    email: 'emma@example.co.uk',
    phone: '7450 164575',
    countryCode: '+44',
    source: 'trip-planner',
    travelCrew: 'Family',
    travelStyles: ['Heritage & Palaces'],
    countryOfResidence: 'United Kingdom',
    currency: 'GBP',
    budgetPerPerson: 3400,
    preferredMonth: '2027-02',
    pageUrl: '/plan-my-trip',
    status: 'booked',
  };
  const response = await post('/api/customize-tour', payload, '203.0.113.20');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);

  const saved = captured().saved.find((entry) => entry.model === 'CustomTour' && entry.doc.email === 'emma@example.co.uk');
  assert.equal(saved.doc.travelCrew, 'Family');
  assert.equal(saved.doc.budgetPerPerson, 3400);
  assert.equal(saved.doc.status, 'new', 'status must come from the schema default, not the visitor');

  const mails = await waitFor(() => {
    const matching = captured().mail.filter((mail) => mail.html.includes('Emma Clarke'));
    return matching.length === 2 && matching;
  }, 'both emails');
  assert.ok(mails.every((mail) => !mail.html.includes('<i>anniversary</i>')));
  assert.ok(mails.some((mail) => mail.html.includes('&lt;i&gt;anniversary&lt;/i&gt;')));
});

test('customize-tour: junk is rejected before anything is stored', async () => {
  const before = captured().saved.length;
  const response = await post('/api/customize-tour', { name: ['x'], email: 'bad', duration: 100000 }, '203.0.113.21');
  assert.equal(response.status, 400);
  assert.deepEqual((await response.json()).errors.map((error) => error.field), ['name', 'email', 'duration']);
  assert.equal(captured().saved.length, before);
});

test('tour reads: one cacheable CORS answer for every origin; admin reads stay per-origin', async () => {
  const headersFor = async (origin, extra = {}) => {
    const response = await fetch(`${BASE}/api/tours?view=card`, { headers: { Origin: origin, ...extra } });
    assert.equal(response.status, 200);
    const pick = (name) => response.headers.get(name);
    return {
      allowOrigin: pick('access-control-allow-origin'),
      credentials: pick('access-control-allow-credentials'),
      vary: pick('vary'),
      cacheControl: pick('cache-control'),
    };
  };

  const www = await headersFor('https://www.orbittrails.com');
  const local = await headersFor('http://localhost:8080');
  assert.deepEqual(www, local, 'a cached copy must be valid for any origin');
  assert.equal(www.allowOrigin, '*');
  assert.equal(www.credentials, null);
  assert.match(www.cacheControl, /^public/);

  const admin = await headersFor('https://www.orbittrails.com', { Authorization: 'Bearer anything' });
  assert.equal(admin.allowOrigin, 'https://www.orbittrails.com');
  assert.equal(admin.cacheControl, 'no-store');
  assert.match(admin.vary, /Origin/);
  assert.match(admin.vary, /Authorization/);
});

test('request bodies: oversized and malformed JSON are refused cleanly', async () => {
  const tooBigForForms = JSON.stringify({ ...validContact, message: 'x'.repeat(30_000) });
  assert.equal((await post('/api/contact', tooBigForForms, '203.0.113.30')).status, 413);
  assert.equal((await post('/api/customize-tour', tooBigForForms, '203.0.113.30')).status, 413);

  // Admin routes keep a larger limit: this body is parsed, then stopped by the login check.
  assert.equal((await post('/api/tours', tooBigForForms, '203.0.113.30')).status, 401);
  // ...but not an unlimited one.
  assert.equal((await post('/api/tours', JSON.stringify({ blob: 'x'.repeat(2_000_000) }), '203.0.113.30')).status, 413);

  const malformed = await post('/api/contact', '{"name": ', '203.0.113.31');
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).success, false);
});

test('login: non-string credentials are rejected and attempts are limited', async () => {
  const ip = '203.0.113.40';
  const operator = await post('/api/admin/login', { username: { $ne: null }, password: { $ne: null } }, ip);
  assert.equal(operator.status, 400);

  for (let i = 0; i < 9; i++) {
    assert.equal((await post('/api/admin/login', { username: 'admin', password: `guess-${i}` }, ip)).status, 401);
  }
  const blocked = await post('/api/admin/login', { username: 'admin', password: 'one-more' }, ip);
  assert.equal(blocked.status, 429);
});

/** HS256 admin token for a fixed id, signed with `secret`. */
function signToken(secret) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ id: '000000000000000000000000' })}`;
  return `${unsigned}.${createHmac('sha256', secret).update(unsigned).digest('base64url')}`;
}

const profile = (base, token) => fetch(`${base}/api/admin/profile`, { headers: { Authorization: `Bearer ${token}` } });

/** Resolves with the exit code, or fails the test instead of hanging if the process keeps running. */
function exitCode(child, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${label}: the server kept running`));
    }, 8000);
    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve(code);
    });
  });
}

test('admin tokens: the configured secret works, the old public default does not', async () => {
  assert.equal((await profile(BASE, signToken(CONFIGURED_SECRET))).status, 200);
  assert.equal((await profile(BASE, signToken(LEGACY_DEFAULT_SECRET))).status, 401);
  assert.equal((await profile(BASE, 'not-a-token')).status, 401);
});

test('startup without JWT_SECRET (non-production): runs on a random secret, never the old default', async () => {
  const port = PORT + 1;
  const base = `http://127.0.0.1:${port}`;
  const { child, output } = startServer({ NODE_ENV: 'development', PORT: String(port) });
  try {
    await waitFor(async () => (await fetch(`${base}/health`)).ok, 'the second server to start');
    assert.match(output(), /JWT_SECRET is not set/);
    assert.equal((await profile(base, signToken(LEGACY_DEFAULT_SECRET))).status, 401);
  } finally {
    child.kill();
  }
});

test('startup: production refuses to run without JWT_SECRET, or with the old default', async () => {
  const missing = startServer({ NODE_ENV: 'production', PORT: String(PORT + 2) });
  assert.equal(await exitCode(missing.child, 'missing JWT_SECRET'), 1);
  assert.match(missing.output(), /JWT_SECRET is not set/);

  const legacy = startServer({ NODE_ENV: 'production', PORT: String(PORT + 2), JWT_SECRET: LEGACY_DEFAULT_SECRET });
  assert.equal(await exitCode(legacy.child, 'legacy JWT_SECRET'), 1);
  assert.match(legacy.output(), /old default value/);
});
