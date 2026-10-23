import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveDeployTarget, getDeployTarget, hasBackend, primaryUrl } from '../docs/.vitepress/theme/utils/deploy-env.js'
const cases = {
  netlify: ['poeticcoder.com', 'www.poeticcoder.com', 'a.poeticcoder.com', 'preview.netlify.app', 'branch--site.netlify.app', 'WWW.POETICCODER.COM.'],
  cloudflare: ['shuyixiao.cn', 'www.shuyixiao.cn', 'a.shuyixiao.cn', 'project.pages.dev', 'hash.project.pages.dev'],
  github: ['poeticcoder.cn', 'www.poeticcoder.cn', 'a.poeticcoder.cn', 'user.github.io'],
  local: ['localhost', '127.0.0.1'],
  unknown: ['', 'poeticcoder.com.evil.test', 'fakepoeticcoder.com', 'poeticcoder.cn.com', 'notshuyixiao.cn', 'shuyixiao.cn.evil', 'notnetlify.app', 'github.io.evil', 'localhost.evil', 'example.org', 'netlify.app', 'pages.dev', 'github.io']
}
for (const [target, hosts] of Object.entries(cases)) for (const host of hosts) test(host || 'empty', () => assert.equal(resolveDeployTarget(host), target))
test('SSR is safe', async () => { assert.equal(getDeployTarget(), 'unknown'); assert.equal(await hasBackend(), false) })
test('canonical route', () => assert.equal(primaryUrl('/about/'), 'https://www.poeticcoder.com/about/'))
test('override only on local host', () => {
  try {
    globalThis.window = { location: { hostname: 'localhost', search: '?__deploy=github' } }
    assert.equal(getDeployTarget(), 'github')
    window.location.hostname = 'www.poeticcoder.com'; assert.equal(getDeployTarget(), 'netlify')
    window.location.hostname = 'www.shuyixiao.cn'; assert.equal(getDeployTarget(), 'cloudflare')
    window.location.hostname = 'localhost'; window.location.search = '?__deploy=unknown'; assert.equal(getDeployTarget(), 'local')
  } finally { delete globalThis.window }
})

let probeCase = 0
async function withClient(run, { host = 'localhost', search = '', storageThrows = false } = {}) {
  const originalFetch = globalThis.fetch
  const storage = new Map()
  globalThis.window = {
    location: { hostname: host, search, origin: 'http://localhost:4173' },
    sessionStorage: {
      getItem: key => { if (storageThrows) throw Error('blocked'); return storage.get(key) ?? null },
      setItem: (key, value) => { if (storageThrows) throw Error('blocked'); storage.set(key, value) }
    }
  }
  try {
    const env = await import(`../docs/.vitepress/theme/utils/deploy-env.js?probe=${++probeCase}`)
    await run(env, storage)
  } finally { globalThis.fetch = originalFetch; delete globalThis.window }
}
for (const host of ['www.shuyixiao.cn', 'www.poeticcoder.cn']) test(`${host} never probes API`, async () => {
  await withClient(async env => { globalThis.fetch = () => { throw Error('must not fetch') }; assert.equal(await env.hasBackend(), false) }, { host })
})
test('Netlify is known synchronously', async () => {
  await withClient(async env => { globalThis.fetch = () => { throw Error('must not probe') }; assert.equal(await env.hasBackend(), true) }, { host: 'preview.netlify.app' })
})
test('local probe is shared and cached', async () => {
  await withClient(async (env, storage) => {
    let calls = 0
    globalThis.fetch = async () => { calls++; return new Response('{}', { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }) }
    assert.deepEqual(await Promise.all([env.hasBackend(), env.hasBackend()]), [true, true])
    assert.equal(await env.hasBackend(), true); assert.equal(calls, 1); assert.ok([...storage.values()].includes('true'))
  })
})
for (const [status, type] of [[200, 'text/html'], [204, 'application/json'], [500, 'application/json']]) test(`probe rejects ${status} ${type}`, async () => {
  await withClient(async env => {
    globalThis.fetch = async () => new Response(status === 204 ? null : '{}', { status, headers: { 'content-type': type } })
    assert.equal(await env.hasBackend(), false)
  })
})
test('storage denial and network failure are safe', async () => {
  await withClient(async env => { globalThis.fetch = async () => { throw Error('offline') }; assert.equal(await env.hasBackend(), false) }, { storageThrows: true })
})
test('probe aborts after three seconds', async () => {
  await withClient(async env => {
    globalThis.fetch = (_, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Error('aborted'))))
    assert.equal(await env.hasBackend(), false)
  })
})
test('stats HTML fallback is never data', async () => {
  await withClient(async env => {
    globalThis.fetch = async () => new Response('<html>404</html>', { headers: { 'content-type': 'text/html' } })
    await assert.rejects(env.backendJson('/api/stats'))
  }, { host: 'www.poeticcoder.com' })
})
