import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveDeployTarget, getDeployTarget, hasBackend, primaryUrl } from '../docs/.vitepress/theme/utils/deploy-env.js'
const cases = {
  netlify: ['poeticcoder.com', 'www.poeticcoder.com', 'a.poeticcoder.com', 'preview.netlify.app', 'branch--site.netlify.app', 'WWW.POETICCODER.COM.'],
  cloudflare: ['shuyixiao.cn', 'www.shuyixiao.cn', 'a.shuyixiao.cn', 'project.pages.dev', 'hash.project.pages.dev'],
  github: ['poeticcoder.cn', 'www.poeticcoder.cn', 'a.poeticcoder.cn', 'user.github.io'],
  local: ['localhost', '127.0.0.1'],
  unknown: ['', 'poeticcoder.com.evil.test', 'fakepoeticcoder.com', 'poeticcoder.cn.com', 'notshuyixiao.cn', 'shuyixiao.cn.evil', 'notnetlify.app', 'github.io.evil', 'localhost.evil', 'example.org']
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
