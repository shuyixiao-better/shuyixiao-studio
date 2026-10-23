// Uses an existing Playwright installation; this project intentionally adds no dependency.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/comments.browser-test.mjs
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
const origin = process.env.COMMENTS_PREVIEW_ORIGIN || 'http://localhost:4173'
const article = '/articles/design-patterns'
const shots = new URL('../.comments-shots/', import.meta.url)
await mkdir(shots, { recursive: true })
const results = [], warnings = [], alerts = []
const sample = () => [
  { id: 'sample-a', path: article, parentId: null, author: '读者甲', content: '这篇文章很有启发，谢谢分享。', createdAt: new Date(Date.now() - 300000).toISOString(), isAuthor: false, replies: [{ id: 'reply-a', path: article, parentId: 'sample-a', author: '舒一笑不秃头', content: '谢谢，欢迎交流实践经验。', isAuthor: true, createdAt: new Date().toISOString() }] },
  { id: 'sample-b', path: article, parentId: null, author: '读者乙', content: '延伸阅读：https://developer.mozilla.org/zh-CN/\n欢迎交流。', isAuthor: false, createdAt: new Date(Date.now() - 86400000).toISOString(), replies: [] },
  { id: 'sample-c', path: article, parentId: null, author: '安全测试', content: '<img src=x onerror=alert(1)>\n<script>alert(2)</script> javascript:alert(3)', isAuthor: false, createdAt: '2025-01-01T00:00:00.000Z', replies: [] }
]
async function prepare({ width = 1440, dark = false, state = 'empty', admin = false, loggedIn = false, deploy = 'netlify', pathname = article } = {}) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 1000 : 1100 }, colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce' })
  await context.addInitScript(({ dark, loggedIn }) => {
    localStorage.setItem('vitepress-theme-appearance', dark ? 'dark' : 'light')
    if (loggedIn) sessionStorage.setItem('comments-admin-session', JSON.stringify({ token: 'mock-admin', expiresAt: Date.now() + 3600000 }))
  }, { dark, loggedIn })
  const page = await context.newPage()
  const requests = []
  let list = state === 'three' || loggedIn ? sample() : []
  let failures = state === 'failure', rejectAdmin = false
  page.on('dialog', async dialog => { alerts.push(dialog.message()); await dialog.dismiss() })
  page.on('console', item => { if (/hydration|mismatch/i.test(item.text())) warnings.push(item.text()) })
  page.on('pageerror', error => { throw new Error(error.message) })
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) return route.abort()
    if (!url.pathname.startsWith('/api/')) return route.continue()
    const request = route.request()
    if (url.pathname === '/api/comments/admin-login') {
      requests.push({ method: 'LOGIN' })
      return route.fulfill({ json: { token: 'mock-admin', expiresAt: Date.now() + 3600000 } })
    }
    if (url.pathname !== '/api/comments') return route.fulfill({ json: {} })
    requests.push({ method: request.method(), body: request.postDataJSON(), authorization: request.headers().authorization })
    if (request.method() === 'GET') return route.fulfill({ status: failures ? 500 : 200, json: failures ? { error: '服务暂时不可用' } : { comments: list, total: list.reduce((sum, item) => sum + 1 + item.replies.length, 0), truncated: false } })
    const body = request.postDataJSON()
    if (rejectAdmin && request.headers().authorization) return route.fulfill({ status: 401, json: { error: '管理登录已过期，请重新登录' } })
    if (state === 'bad-request') return route.fulfill({ status: 400, json: { error: '评论最多包含 2 个链接' } })
    if (request.method() === 'DELETE') {
      list = list.filter(item => item.id !== body.id)
      return route.fulfill({ json: { success: true } })
    }
    if (state === 'rate-limit') return route.fulfill({ status: 429, json: { error: 'too frequent' } })
    if (body.parentId) return route.fulfill({ status: 201, json: { success: true, comment: { id: 'mock-reply', path: article, parentId: body.parentId, author: '舒一笑不秃头', content: body.content, createdAt: new Date().toISOString(), isAuthor: true } } })
    const comment = { id: 'mock-created', path: article, parentId: null, author: body.author, content: body.content, createdAt: new Date().toISOString(), isAuthor: false }
    return route.fulfill({ status: 201, json: { success: true, comment } })
  })
  await page.goto(`${origin}${pathname}?__deploy=${deploy}${admin ? '&admin=1' : ''}`, { waitUntil: 'networkidle' })
  return { context, page, requests, retry: () => { failures = false }, expire: () => { rejectAdmin = true } }
}
async function reveal(page) {
  const section = page.locator('.comment-section')
  await section.scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !document.querySelector('.comment-skeleton'))
  return section
}
async function capture(page, name, selector = '.comment-section') {
  await page.locator(selector).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100))
  await page.screenshot({ path: new URL(`${name}.png`, shots).pathname })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `horizontal overflow: ${name}`)
  results.push(name)
}
try {
  for (const width of [1440, 390]) for (const dark of [false, true]) {
    const mode = `${width}-${dark ? 'dark' : 'light'}`
    for (const state of ['empty', 'three', 'failure', 'success', 'rate-limit', 'admin-login', 'admin-active']) {
      const admin = state.startsWith('admin-')
      const session = await prepare({ width, dark, state, admin, loggedIn: state === 'admin-active' })
      const { page, requests, context } = session
      // The article is long: no comment function call is allowed before approaching the section.
      assert.equal(requests.filter(item => item.method === 'GET').length, 0, `eager request: ${state}`)
      await reveal(page)
      if (!admin) assert.equal(await page.locator('.comment-admin-bar, .comment-actions, .comment-reply-form').count(), 0)
      if (state === 'empty') assert.match(await page.locator('.comment-state').textContent(), /还没有评论/)
      if (state === 'failure') {
        assert.match(await page.locator('.comment-state').textContent(), /评论加载失败/)
        assert.equal(await page.getByText('还没有评论，来说点什么吧。').count(), 0)
      }
      if (state === 'three') {
        assert.equal(await page.locator('.comment-content img, .comment-content script').count(), 0)
        assert.ok((await page.locator('.comment-content').allTextContents()).some(text => text.includes('<img src=x onerror=alert(1)>')))
        assert.equal(await page.locator('.comment-content a').getAttribute('rel'), 'nofollow ugc noopener noreferrer')
        assert.equal(await page.locator('.comment-author-badge').count(), 1)
      }
      if (state === 'success' || state === 'rate-limit') {
        await page.locator('#comment-author').fill('测试昵称')
        await page.locator('#comment-content').fill('一条新的纯文本评论')
        await page.waitForTimeout(3000)
        await page.locator('#comment-content').press('Control+Enter')
        await page.getByText(state === 'success' ? '评论已发表，谢谢你的分享。' : '评论太频繁，请稍后再试', { exact: true }).waitFor()
        assert.equal(await page.locator('#comment-author').inputValue(), '测试昵称')
        assert.equal(await page.locator('#comment-content').inputValue(), state === 'success' ? '' : '一条新的纯文本评论')
        if (state === 'success') assert.equal(await page.locator('.comment-list > .comment-item').first().locator('.comment-name').textContent(), '测试昵称')
      }
      if (state === 'admin-login') assert.equal(await page.locator('#comment-password').count(), 1)
      if (state === 'admin-active') assert.equal(await page.getByRole('button', { name: '回复', exact: true }).count(), 3)
      await capture(page, `${state}-${mode}`)
      if (state === 'failure') {
        session.retry()
        await page.getByRole('button', { name: '重试', exact: true }).click()
        await page.getByText('还没有评论，来说点什么吧。', { exact: true }).waitFor()
      }
      if (state === 'success') {
        await page.reload({ waitUntil: 'networkidle' })
        await reveal(page)
        assert.equal(await page.locator('#comment-author').inputValue(), '测试昵称')
      }
      if (state === 'admin-login') {
        await page.locator('#comment-password').fill('test')
        await page.getByRole('button', { name: '登录', exact: true }).click()
        await page.getByText('已进入管理模式 ·', { exact: false }).waitFor()
        assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem('comments-admin-session')).token), 'mock-admin')
      }
      if (state === 'admin-active') {
        await page.getByRole('button', { name: '回复', exact: true }).first().click()
        await page.locator('.comment-reply-form textarea').fill('真实界面回复测试')
        await page.getByRole('button', { name: '发表回复', exact: true }).click()
        await page.getByText('真实界面回复测试', { exact: true }).waitFor()
        assert.equal(requests.find(item => item.body?.parentId)?.authorization, 'Bearer mock-admin')
        const first = page.locator('.comment-list > .comment-item').first()
        await first.locator(':scope > .comment-main > .comment-actions').getByRole('button', { name: '删除', exact: true }).click()
        await first.locator(':scope > .comment-main > .comment-actions').getByRole('button', { name: '确认', exact: true }).click()
        await page.waitForFunction(() => document.querySelectorAll('.comment-list > .comment-item').length === 2)
        await page.getByRole('button', { name: '退出', exact: true }).click()
        assert.equal(await page.locator('.comment-actions').count(), 0)
      }
      await context.close()
    }
  }
  for (const [name, options, selector] of [
    ['cloudflare-article', { deploy: 'cloudflare' }, '.comments-placeholder'],
    ['privacy-no-comments', { pathname: '/policies/privacy-policy' }, '.VPDoc']
  ]) {
    const { context, page, requests } = await prepare(options)
    await page.locator(selector).scrollIntoViewIfNeeded()
    if (name === 'cloudflare-article') {
      assert.equal(await page.locator('.comment-section').count(), 0)
      assert.match(await page.locator('.comments-placeholder a').getAttribute('href'), /^https:\/\/www.poeticcoder.com\/articles\/design-patterns#评论区$/)
    } else assert.equal(await page.locator('.comment-section, .comments-placeholder').count(), 0)
    assert.equal(requests.length, 0)
    await capture(page, name, selector)
    await context.close()
  }
  {
    const session = await prepare({ admin: true, loggedIn: true })
    await reveal(session.page)
    session.expire()
    await session.page.getByRole('button', { name: '回复', exact: true }).first().click()
    await session.page.locator('.comment-reply-form textarea').fill('过期会话回复')
    await session.page.getByRole('button', { name: '发表回复', exact: true }).click()
    await session.page.locator('#comment-password').waitFor()
    assert.equal(await session.page.locator('.comment-actions').count(), 0)
    assert.equal(await session.page.evaluate(() => sessionStorage.getItem('comments-admin-session')), null)
    await session.context.close()
  }
  {
    const { page, context } = await prepare({ state: 'bad-request' })
    await reveal(page)
    await page.locator('#comment-author').fill('普通读者')
    await page.locator('#comment-content').fill('服务端校验测试')
    await page.getByRole('button', { name: '发表评论', exact: true }).click()
    await page.getByText('评论最多包含 2 个链接', { exact: true }).waitFor()
    await context.close()
  }
  assert.deepEqual(alerts, [])
  assert.deepEqual(warnings, [])
  await writeFile(new URL('results.json', shots), JSON.stringify({ screenshots: results, count: results.length, alerts, hydrationWarnings: warnings, verified: ['lazy load', 'safe text rendering', 'link rel', 'retry', 'nickname persistence', 'keyboard submit', 'admin login/reply/delete/logout', 'static fallback', 'privacy exclusion', 'no horizontal overflow', '401 session reset', '400 validation message', 'Bearer authorization'] }, null, 2))
  console.log(`PASS: ${results.length} screenshots, no XSS dialogs, no hydration warnings, no horizontal overflow`)
} finally { await browser.close() }
