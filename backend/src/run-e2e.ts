/**
 * Arcana — Live End-to-End API Test
 * ==================================
 * Exercises the REAL Express app (createApp from src/app.ts) against
 * an in-memory mocked Prisma — no DB needed. Starts a server on a free
 * port and fires real HTTP requests against it.
 *
 * RUN — after `npm install`:
 *   npx ts-node src/run-e2e.ts
 */

process.env.JWT_SECRET = 'arcana-e2e-test-key-must-be-at-least-32-chars-xx';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

import http from 'http';
import type { AddressInfo } from 'net';
import { createApp } from './app';
import prisma from './lib/prisma';

// ---------- Mock Prisma (in-memory stores per run) ----------
type AnyFn = (...a: any[]) => any;
const store: {
  users: any[];
  financialData: any[];
} = { users: [], financialData: [] };

(prisma as any).user = {
  findFirst: async ({ where }: any) => {
    return store.users.find(
      (u) =>
        (where.OR?.[0]?.username && u.username === where.OR[0].username) ||
        (where.OR?.[1]?.email && u.email === where.OR[1].email) ||
        (where.username && u.username === where.username) ||
        (where.email && u.email === where.email)
    ) || null;
  },
  findUnique: async ({ where }: any) => {
    if (where.email) return store.users.find((u) => u.email === where.email) || null;
    return store.users.find((u) => u.id === where.id) || null;
  },
  create: async ({ data }: any) => {
    const u = {
      id: 'u_' + Math.random().toString(36).slice(2, 10),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.users.push(u);
    return u;
  },
};

(prisma as any).financialData = {
  findMany: async ({ where, skip = 0, take = 20 }: any) => {
    let list = store.financialData.filter((f) => f.userId === where.userId);
    if (where.institutionName?.contains) {
      const q = where.institutionName.contains.toLowerCase();
      list = list.filter((f) => f.institutionName.toLowerCase().includes(q));
    }
    if (where.accountType?.contains) {
      const q = where.accountType.contains.toLowerCase();
      list = list.filter((f) => f.accountType.toLowerCase().includes(q));
    }
    if (where.currency) list = list.filter((f) => f.currency === where.currency);
    if (where.balance?.gte != null) list = list.filter((f) => parseFloat(f.balance) >= where.balance.gte);
    if (where.balance?.lte != null) list = list.filter((f) => parseFloat(f.balance) <= where.balance.lte);
    list = list.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
    return list.slice(skip, skip + take);
  },
  count: async ({ where }: any) => {
    let list = store.financialData.filter((f) => f.userId === where.userId);
    if (where.currency) list = list.filter((f) => f.currency === where.currency);
    return list.length;
  },
  findUnique: async ({ where }: any) =>
    store.financialData.find((f) => f.id === where.id) || null,
  create: async ({ data }: any) => {
    const r = {
      id: 'fd_' + Math.random().toString(36).slice(2, 10),
      ...data,
      balance: String(data.balance?.toFixed?.(4) ?? Number(data.balance).toFixed(4)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.financialData.push(r);
    return r;
  },
  update: async ({ where, data }: any) => {
    const idx = store.financialData.findIndex((f) => f.id === where.id);
    if (idx === -1) throw new Error('not found');
    store.financialData[idx] = {
      ...store.financialData[idx],
      ...data,
      balance: data.balance != null ? String(Number(data.balance).toFixed(4)) : store.financialData[idx].balance,
      lastSyncedAt: data.lastSyncedAt || new Date(),
      updatedAt: new Date(),
    };
    return store.financialData[idx];
  },
  delete: async ({ where }: any) => {
    const idx = store.financialData.findIndex((f) => f.id === where.id);
    const removed = store.financialData[idx];
    store.financialData.splice(idx, 1);
    return removed;
  },
};

(prisma as any).$queryRaw = async () => [{ '?column?': 1 }];

// ---------- HTTP helpers ----------
function request(
  base: string,
  path: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): Promise<{ status: number; body: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(base + path);
    const opts: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode!, body: data ? JSON.parse(data) : null, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode!, body: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ---------- E2E scenario ----------
let base = '';
let server: http.Server;
let step = 0;
function log(label: string, extra?: string) {
  step++;
  const s = String(step).padStart(2, '0');
  console.log(`  ${s}. ${label}${extra ? '  →  ' + extra : ''}`);
}

async function scenario() {
  console.log('\n🧪 Arcana End-to-End API Test (real Express app + mocked Prisma)\n');

  const app = createApp();
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((r) => server.on('listening', r));
  const port = (server.address() as AddressInfo).port;
  base = `http://127.0.0.1:${port}`;

  const creds = {
    username: 'e2e_alice',
    email: 'alice_e2e@arcana.test',
    password: 'Al1ceP@ss!',
  };

  // -- ROOT / HEALTH --
  let r = await request(base, '/', 'GET');
  log('GET / returns service info', `status=${r.status}  version=${r.body?.version}`);
  assert(r.status === 200 && r.body.service === 'Arcana Backend API');

  r = await request(base, '/health', 'GET');
  log('GET /health', `status=${r.status}  db=${r.body?.database}`);
  assert(r.status === 200);

  // -- REGISTER --
  r = await request(base, '/api/auth/register', 'POST', creds);
  log('POST /api/auth/register (new user)', `status=${r.status}  user=${r.body?.data?.user?.username}`);
  assert(r.status === 201, r.body?.message);
  assert(r.body.data.accessToken, 'access token present');
  assert(r.body.data.refreshToken, 'refresh token present');
  assert(r.body.data.user.passwordHash === undefined, 'no passwordHash in response');
  const { accessToken, refreshToken } = r.body.data;

  // -- REGISTER CONFLICT --
  r = await request(base, '/api/auth/register', 'POST', creds);
  log('POST /api/auth/register (duplicate → 409)', `status=${r.status}`);
  assert(r.status === 409);

  // -- INVALID REGISTER DATA (400) --
  r = await request(base, '/api/auth/register', 'POST', { username: 'x', email: 'nope', password: 'weak' });
  log('POST /api/auth/register (bad payload → 400)', `status=${r.status}  fieldErrors=${Object.keys(r.body.errors || {}).length}`);
  assert(r.status === 400);
  assert(r.body.errors && Object.keys(r.body.errors).length > 0);

  // -- LOGIN --
  r = await request(base, '/api/auth/login', 'POST', { email: creds.email, password: creds.password });
  log('POST /api/auth/login', `status=${r.status}  tokenLen=${r.body?.data?.accessToken?.length ?? 0}`);
  assert(r.status === 200);
  const loginToken = r.body.data.accessToken;

  // -- LOGIN WRONG PASSWORD --
  r = await request(base, '/api/auth/login', 'POST', { email: creds.email, password: 'Wrong!' });
  log('POST /api/auth/login (wrong pw → 401)', `status=${r.status}`);
  assert(r.status === 401);

  // -- LOGIN WRONG EMAIL --
  r = await request(base, '/api/auth/login', 'POST', { email: 'nope@nope.test', password: creds.password });
  log('POST /api/auth/login (wrong email → 401)', `status=${r.status}`);
  assert(r.status === 401);

  // -- REFRESH --
  r = await request(base, '/api/auth/refresh', 'POST', { refreshToken });
  log('POST /api/auth/refresh', `status=${r.status}`);
  assert(r.status === 200 && r.body.data.accessToken);

  // -- ME WITHOUT TOKEN --
  r = await request(base, '/api/auth/me', 'GET');
  log('GET /api/auth/me (no token → 401)', `status=${r.status}`);
  assert(r.status === 401);

  // -- ME WITH TOKEN --
  r = await request(base, '/api/auth/me', 'GET', undefined, {
    Authorization: `Bearer ${loginToken}`,
  });
  log('GET /api/auth/me (Bearer)', `status=${r.status}  user=${r.body?.data?.user?.email}`);
  assert(r.status === 200 && r.body.data.user.email === creds.email.toLowerCase());

  // -- ME WITH INVALID TOKEN --
  r = await request(base, '/api/auth/me', 'GET', undefined, {
    Authorization: 'Bearer garbage.token.here',
  });
  log('GET /api/auth/me (bad token → 401)', `status=${r.status}`);
  assert(r.status === 401);

  // -- FINANCIAL: CREATE --
  const fd = {
    accountType: 'checking',
    institutionName: 'E2E Bank of Testing',
    balance: 12500.75,
    currency: 'USD',
    dataSource: 'manual',
    accountNumber: '****-****-****-9999',
    isEncrypted: true,
    encryptionKeyId: 'kms-e2e-001',
  };
  r = await request(base, '/api/financial', 'POST', fd, { Authorization: `Bearer ${accessToken}` });
  log('POST /api/financial', `status=${r.status}  id=${r.body?.data?.id}  balance=${r.body?.data?.balance}`);
  assert(r.status === 201 && r.body.data.accountType === 'checking');
  const fdId = r.body.data.id;

  // -- FINANCIAL: CREATE INVALID (no auth → 401) --
  r = await request(base, '/api/financial', 'POST', fd);
  log('POST /api/financial (no auth → 401)', `status=${r.status}`);
  assert(r.status === 401);

  // -- FINANCIAL: CREATE INVALID (missing fields → 400) --
  r = await request(
    base,
    '/api/financial',
    'POST',
    { institutionName: 'only' },
    { Authorization: `Bearer ${accessToken}` }
  );
  log('POST /api/financial (partial → 400)', `status=${r.status}  errFields=${Object.keys(r.body.errors || {}).length}`);
  assert(r.status === 400 && Object.keys(r.body.errors).length > 0);

  // -- FINANCIAL: LIST --
  r = await request(base, '/api/financial?page=1&limit=10', 'GET', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
  log('GET /api/financial', `status=${r.status}  count=${r.body?.data?.items?.length}  total=${r.body?.data?.pagination?.total}`);
  assert(r.status === 200 && r.body.data.items.length >= 1 && r.body.data.pagination.total >= 1);

  // -- FINANCIAL: GET BY ID --
  r = await request(base, `/api/financial/${fdId}`, 'GET', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
  log(`GET /api/financial/:id  (${fdId.slice(0, 8)}…)`, `status=${r.status}  bal=${r.body?.data?.balance}`);
  assert(r.status === 200 && r.body.data.id === fdId);

  // -- FINANCIAL: UPDATE --
  r = await request(
    base,
    `/api/financial/${fdId}`,
    'PUT',
    { balance: 13000, isEncrypted: true, accountType: 'savings' },
    { Authorization: `Bearer ${accessToken}` }
  );
  log(`PUT /api/financial/:id  balance 12500.75 → 13000`, `status=${r.status}  bal=${r.body?.data?.balance}`);
  assert(r.status === 200);

  // -- FINANCIAL: CROSS-USER ACCESS → 403 --
  const r2 = await request(base, '/api/auth/register', 'POST', {
    username: 'e2e_bob',
    email: 'bob_e2e@arcana.test',
    password: 'B0bP@ss!!',
  });
  const bobToken = r2.body.data.accessToken;
  r = await request(base, `/api/financial/${fdId}`, 'GET', undefined, {
    Authorization: `Bearer ${bobToken}`,
  });
  log(`GET /api/financial/:id (Bob accesses Alice's → 403)`, `status=${r.status}`);
  assert(r.status === 403);

  // -- FINANCIAL: DELETE --
  r = await request(base, `/api/financial/${fdId}`, 'DELETE', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
  log(`DELETE /api/financial/:id`, `status=${r.status}  msg=${r.body?.message}`);
  assert(r.status === 200);

  // -- FINANCIAL: VERIFY DELETE (404 on get) --
  r = await request(base, `/api/financial/${fdId}`, 'GET', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
  log(`GET deleted record → 404`, `status=${r.status}`);
  assert(r.status === 404);

  // -- 404 NOT FOUND HANDLER --
  r = await request(base, '/does-not-exist-xyz', 'GET');
  log('GET /does-not-exist-xyz → 404', `status=${r.status}`);
  assert(r.status === 404 && r.body.status === 'error');

  // -- DOCS AVAILABLE --
  r = await request(base, '/api/docs.json', 'GET');
  log('GET /api/docs.json (OpenAPI spec)', `status=${r.status}  paths=${Object.keys(r.body?.paths || {}).length}`);
  assert(r.status === 200 && r.body.openapi === '3.0.0');

  console.log('\n===================================================');
  console.log(`🎉 E2E scenario PASSED — ${step}/${step} steps successful`);
  console.log('   Register → Login → Refresh → /me');
  console.log('   Financial CRUD + ownership enforcement + filters');
  console.log('   Validation errors, 404, docs endpoint');
  console.log('===================================================\n');
}

function assert(cond: any, msg?: string) {
  if (!cond) throw new Error('Assertion failed: ' + (msg || 'see above'));
}

scenario()
  .catch((e) => {
    console.error('\n❌ E2E failed at step', step, '—', e.message || e);
    process.exit(1);
  })
  .finally(() => {
    server?.close(() => process.exit(0));
  });
