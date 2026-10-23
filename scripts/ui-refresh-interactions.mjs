import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}), headless: true })
const origin = 'http://localhost:4173'
const passed = []
async function check(name, run) { await run(); passed.push(name); console.log('PASS', name) }
async function client(target = 'netlify', statsMode = 'json', viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  await context.route(/https?:\/\/(?!localhost|127\.0\.0\.1)/, r => r.abort())
  await context.route('**/.netlify/functions/**', r => r.fulfill({ contentType: 'application/json', body: '{"comments":[]}' }))
  await context.route('**/api/**', async r => {
    const url = new URL(r.request().url())
    if (url.pathname === '/api/stats' && statsMode === 'timeout') { await new Promise(resolve => setTimeout(resolve, 3300)); try { await r.abort() } catch {} return }
    if (url.pathname === '/api/stats' && statsMode === 'html') return r.fulfill({ contentType: 'text/html', body: '<html>404</html>' })
    if (url.pathname === '/api/pandacoder-proxy') return r.fulfill({ contentType: 'text/html', body: '<html><body>Weekly fixture</body></html>' })
    if (url.pathname === '/api/chat') return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ reply: '建议先比较价格，再决定是否购买。', response: '建议先比较价格，再决定是否购买。', message: '建议先比较价格，再决定是否购买。' }) })
    const liked = url.searchParams.get('action') === 'like'
    return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ visits: 1234, views: 128, likes: liked ? 13 : 12, hasLiked: liked, success: true }) })
  })
  const page = await context.newPage()
  const requests = [], errors = []
  page.on('request', r => { if (/\/(?:api\/|\.netlify\/functions\/)/.test(new URL(r.url()).pathname)) requests.push(r.url()) })
  page.on('pageerror', e => errors.push(e.message))
  const goto = async path => {
    await page.goto(origin + path + '?__deploy=' + target)
    await page.waitForFunction(() => !!document.getElementById('site-runtime')?.textContent)
    await page.waitForTimeout(350)
  }
  return { page, context, goto, requests, errors }
}
try {
 await check('首页字号、四列/三列与详情展开', async () => {
  const { page, context, goto } = await client()
  await goto('/')
  const values = await page.evaluate(() => ({ hero: getComputedStyle(document.querySelector('.home-hero h1')).fontSize, exploring: getComputedStyle(document.querySelector('.exploring-grid')).gridTemplateColumns.split(' ').length, nav: getComputedStyle(document.querySelector('.home-nav-grid')).gridTemplateColumns.split(' ').length, title: getComputedStyle(document.querySelector('.recent-list a')).color, text: getComputedStyle(document.documentElement).getPropertyValue('--vp-c-text-1').trim() }))
  assert.equal(values.hero, '56px'); assert.equal(values.exploring, 4); assert.equal(values.nav, 3); assert.equal(values.title, 'rgb(28, 27, 25)')
  await page.locator('.product-details summary').first().click()
  assert.equal(await page.locator('.product-details').first().getAttribute('open'), '')
  await context.close()
 })
 await check('文章列表搜索、筛选、分页与全宽', async () => {
  const { page, context, goto } = await client()
  await goto('/articles/')
  assert.ok(await page.locator('.article-list-page').evaluate(el => el.getBoundingClientRect().width) >= 1000)
  await page.locator('.size-option').filter({ hasText: /^20$/ }).click(); assert.equal(await page.locator('.article-card').count(), 20)
  await page.locator('.pagination-btn').filter({ hasText: '下一页' }).click()
  await page.locator('.search-input').fill('不存在的文章xyz'); assert.equal(await page.locator('.article-card').count(), 0)
  await page.locator('.reset-btn').click(); assert.equal(await page.locator('.article-card').count(), 20)
  await page.locator('.filter-tag').nth(1).click(); assert.ok(await page.locator('.article-card').count() > 0)
  await context.close()
 })
 await check('点赞、反馈弹窗与键盘焦点', async () => {
  const { page, context, goto } = await client()
  await goto('/about/')
  await page.locator('.article-stats button').click(); await page.waitForFunction(() => document.querySelector('.article-stats button')?.textContent.includes('13 已赞')); assert.match(await page.locator('.article-stats button').innerText(), /13 已赞/)
  await page.keyboard.press('Tab')
  await page.getByRole('button', { name: '给作者留言', exact: true }).focus()
  assert.equal(await page.locator('.feedback-button').evaluate(el => getComputedStyle(el).outlineWidth), '2px')
  await page.locator('.feedback-button').click(); assert.equal(await page.locator('.feedback-modal').isVisible(), true)
  await page.keyboard.press('Escape'); await page.locator('.feedback-modal').waitFor({ state: 'detached' }); assert.equal(await page.locator('.feedback-modal').count(), 0)
  await context.close()
 })
 for (const mode of ['html', 'timeout']) await check('统计异常静默降级：' + mode, async () => {
  const { page, context, goto } = await client('netlify', mode)
  await goto('/about/'); await page.waitForTimeout(mode === 'timeout' ? 3300 : 300)
  assert.equal(await page.locator('.article-stats button').count(), 0)
  assert.equal(await page.locator('.article-stats > *').count(), 3)
  assert.equal((await page.locator('#site-visits-container').getAttribute('class') || '').includes('has-visits'), false)
  assert.equal(await page.locator('#site-visits-container').evaluate(el => getComputedStyle(el, '::before').content), 'none')
  await context.close()
 })
 for (const target of ['cloudflare', 'github']) await check(target + ' 无后台请求且同路径引导', async () => {
  const { page, context, goto, requests, errors } = await client(target)
  for (const route of ['/about/', '/tools/consumer-copilot/', '/tools/pandacoder-weekly/']) {
   await goto(route)
   assert.equal(await page.locator('.feedback-button').count(), 0)
   assert.equal(await page.locator('.pandacoder-container iframe').count(), 0)
   const links = await page.locator('.requires-backend-notice a').evaluateAll(els => els.map(el => new URL(el.href).pathname))
   assert.ok(links.length && links.every(path => path === route))
  }
  assert.deepEqual(requests, []); assert.deepEqual(errors, [])
  await context.close()
 })
 await check('390px 手机单列、字号、菜单与404', async () => {
  const { page, context, goto, errors } = await client('cloudflare', 'json', { width: 390, height: 844 })
  await goto('/')
  assert.equal(await page.locator('.home-hero h1').evaluate(el => getComputedStyle(el).fontSize), '36px')
  assert.equal(await page.locator('.exploring-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1)
  await page.locator('.VPNavBarHamburger').click(); assert.equal(await page.locator('.VPNavScreen').isVisible(), true)
  await goto('/404.html'); assert.equal(await page.locator('.not-found-container h1').innerText(), '此处暂无内容')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  assert.deepEqual(errors, []); await context.close()
 })
 await fs.writeFile('.ui-refresh-shots/interactions.json', JSON.stringify({ passed }, null, 2))
} finally { await browser.close() }
