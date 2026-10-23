import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizePath, validateComment, isReservedName, linkify, shouldShowComments } from '../docs/.vitepress/theme/utils/comments-core.js'
import { createHandler, signToken, verifyToken, getSecret, escapeHtml, notification } from '../netlify/functions/comments.mjs'

const PATH = '/articles/comments-test'
const ENV = { ADMIN_PASSWORD: 'test-password', COMMENT_SECRET: 'test-only-secret' }
class MemoryStore {
  data = new Map()
  async get(key) { return structuredClone(this.data.get(key) ?? null) }
  async setJSON(key, value) { this.data.set(key, structuredClone(value)) }
  async delete(key) { this.data.delete(key) }
  async list({ prefix }) { return { blobs: [...this.data.keys()].filter(key => key.startsWith(prefix)).map(key => ({ key })) } }
}
function setup(env = ENV) {
  let clock = 1790000000000
  const commentStore = new MemoryStore(), metaStore = new MemoryStore(), mails = []
  const handler = createHandler({ commentStore, metaStore, env, now: () => clock, sendMail: async mail => { mails.push(mail) } })
  async function request(method = 'GET', body, { token, ip = '198.51.100.3', login = false, path = PATH, context = {} } = {}) {
    const req = new Request(`https://example.test/api/comments${login ? '/admin-login' : method === 'GET' ? `?path=${encodeURIComponent(path)}` : ''}`, {
      method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'x-nf-client-connection-ip': ip },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    })
    const response = await handler(req, context)
    return { status: response.status, headers: response.headers, data: response.status === 204 ? null : await response.json() }
  }
  const post = (body = {}, opts) => request('POST', { path: PATH, author: '访客', content: '这是一条评论', hp: '', elapsedMs: 4000, ...body }, opts)
  const login = async () => (await request('POST', { password: ENV.ADMIN_PASSWORD }, { login: true })).data.token
  return { commentStore, metaStore, mails, handler, request, post, login, now: () => clock, advance: ms => { clock += ms } }
}

for (const [input, expected] of [
  ['/articles/a.html?x=1#评论区', '/articles/a'], ['articles/a', '/articles/a'], ['/tutorials/x/index.html', '/tutorials/x/'],
  ['/series/x/', '/series/x/'], ['/insights/%E4%B8%AD%E6%96%87.html', '/insights/中文'], ['/projects//x', '/projects/x'], ['/interview/x/index', '/interview/x/']
]) test(`normalizePath ${input}`, () => assert.equal(normalizePath(input), expected))
for (const input of ['/about/a', '/tools/x', '/articles', '', null, '/articles/%zz', '/articles/../about', '/articles/%2e%2e/about', '/articles/a%2Fb', '/articles/a\\b', '/articles/a%00']) {
  test(`normalizePath rejects ${input}`, () => assert.throws(() => normalizePath(input)))
}
test('validation trims, removes controls, collapses newlines and handles boundaries', () => {
  assert.deepEqual(validateComment({ author: ' a\u0001 ', content: ' \u0000ab\n\n\ncd ' }), { author: 'a', content: 'ab\n\ncd' })
  for (const [author, content] of [['a', 'ab'], ['a'.repeat(20), 'x'.repeat(500)]]) assert.ok(!validateComment({ author, content }).error)
  for (const [author, content] of [['', 'ab'], ['a'.repeat(21), 'ab'], ['a', 'a'], ['a', 'x'.repeat(501)]]) assert.ok(validateComment({ author, content }).error)
  assert.ok(validateComment({ author: 12, content: {} }).error)
})
test('reserved nicknames cannot impersonate the author', () => {
  for (const name of ['舒一笑不秃头', '站 长', '我是博主', '作 者', 'ADMin123']) {
    assert.equal(isReservedName(name), true)
    assert.equal(validateComment({ author: name, content: 'hello' }).error, '该昵称为保留昵称')
  }
  assert.ok(!validateComment({ content: '作者回复' }, { isAuthor: true }).error)
})
test('at most two links', () => {
  assert.ok(!validateComment({ author: 'a', content: 'https://a.test http://b.test' }).error)
  assert.ok(validateComment({ author: 'a', content: 'https://a.test http://b.test https://c.test' }).error)
  assert.ok(validateComment({ author: 'a', content: 'https://a.test,http://b.test,https://c.test' }).error)
})
test('linkify preserves XSS markup as text and only marks http(s)', () => {
  const raw = 'javascript:alert(1) data:text/html,<script>alert(2)</script> <img src=x onerror=alert(1)> https://example.com/path，末尾'
  const parts = linkify(raw)
  assert.equal(parts.map(part => part.value).join(''), raw)
  assert.deepEqual(parts.filter(part => part.type === 'link'), [{ type: 'link', value: 'https://example.com/path' }])
  assert.equal(linkify('javascript:https://bad.test').some(p => p.type === 'link'), false)
  assert.equal(linkify('<script>https://a.test</script>').map(p => p.value).join(''), '<script>https://a.test</script>')
})
test('visibility applies layout, weekly tool exclusion, explicit flags, path and index defaults', () => {
  for (const path of ['/articles/a', '/tutorials/a', '/insights/a', '/series/a', '/interview/a', '/projects/a']) assert.equal(shouldShowComments({ path, relativePath: 'articles/a.md' }), true)
  for (const path of ['/', '/about/', '/policies/privacy-policy', '/tools/a', '/articles/']) assert.equal(shouldShowComments({ path, relativePath: 'articles/index.md' }), false)
  assert.equal(shouldShowComments({ path: '/tutorials/a/', relativePath: 'tutorials/a/index.md', frontmatter: { comments: true } }), true)
  assert.equal(shouldShowComments({ path: PATH, frontmatter: { comments: false } }), false)
  assert.equal(shouldShowComments({ path: PATH, frontmatter: { layout: 'home', comments: true } }), false)
  assert.equal(shouldShowComments({ path: '/tools/pandacoder-weekly/', frontmatter: { comments: true } }), false)
  assert.equal(shouldShowComments({ path: '/about/', frontmatter: { comments: true } }), true)
})
test('token signs, verifies, rejects wrong key, tampering, role and expiration', () => {
  const timestamp = 1790000000000
  const { token, expiresAt } = signToken('key', timestamp)
  assert.equal(expiresAt, timestamp + 43200000)
  assert.equal(verifyToken(token, 'key', timestamp), true)
  for (const [value, secret, at] of [[token, 'wrong', timestamp], [token + 'x', 'key', timestamp], [token, 'key', expiresAt], ['broken', 'key', timestamp], [token + '.extra', 'key', timestamp]]) assert.equal(verifyToken(value, secret, at), false)
  const [payload, signature] = token.split('.')
  assert.equal(verifyToken(`${Buffer.from(JSON.stringify({ role: 'guest', exp: expiresAt })).toString('base64url')}.${signature}`, 'key', timestamp), false)
  assert.equal(getSecret({ ADMIN_PASSWORD: 'a' }), getSecret({ ADMIN_PASSWORD: 'a' }))
  assert.notEqual(getSecret({ ADMIN_PASSWORD: 'a' }), getSecret({ ADMIN_PASSWORD: 'b' }))
  assert.ok(payload)
})
test('visitor creates independent records, lists public fields, and sends escaped mail', async () => {
  const app = setup()
  const result = await app.post({ author: '<img onerror=x>', content: '<script>alert(1)</script>\n正文' })
  assert.equal(result.status, 201)
  assert.match(result.data.comment.id, /^\d{13}-[a-f0-9]{8}$/)
  const list = await app.request()
  assert.equal(list.data.comments.length, 1)
  assert.equal(list.data.total, 1)
  assert.equal(list.headers.get('Cache-Control'), 'no-store')
  assert.equal(list.headers.get('Access-Control-Allow-Origin'), null)
  assert.ok(!JSON.stringify(list.data).includes('198.51.100.3'))
  assert.match(app.mails[0].html, /&lt;script&gt;/)
  assert.ok(!app.mails[0].html.includes('<img'))
  assert.match(app.mails[0].html, /white-space: pre-wrap/)
  assert.match(app.mails[0].html, /\?admin=1#评论区/)
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;')
  assert.ok(notification(result.data.comment).text.includes('正文'))
})
test('concurrent submissions do not overwrite and UUIDs distinguish identical timestamps', async () => {
  const app = setup()
  await Promise.all(Array.from({ length: 30 }, (_, i) => app.post({ content: `评论${i}` }, { ip: `ip-${i}` })))
  assert.equal((await app.request()).data.total, 30)
})
test('legacy canonical and .html data merge, strip images, and do not rewrite on GET', async () => {
  const app = setup()
  await app.commentStore.setJSON('articles/comments-test', [{ id: 1, author: '旧访客', content: '旧评论', images: ['base64'], timestamp: '2025-01-01T00:00:00Z' }])
  await app.commentStore.setJSON('articles/comments-test.html', [{ id: 2, author: '旧访客2', content: '旧评论2', timestamp: '2025-01-02T00:00:00Z' }])
  await app.post()
  const data = (await app.request()).data
  assert.equal(data.total, 3)
  assert.equal(data.comments[1].id, 'legacy:2')
  assert.equal(data.comments[2].isAuthor, false)
  assert.ok(!JSON.stringify(data).includes('base64'))
  assert.deepEqual((await app.commentStore.get('articles/comments-test'))[0].images, ['base64'])
})
test('legacy index.html keys work after /index normalization', async () => {
  const app = setup()
  await app.commentStore.setJSON('tutorials/x/index.html', [{ id: 'old', author: '旧昵称', content: '文章', timestamp: '2025-01-01' }])
  assert.equal((await app.request('GET', undefined, { path: '/tutorials/x/index.html' })).data.comments[0].id, 'legacy:old')
})
test('admin login, reply rules, chronological replies, cascading deletion', async () => {
  const app = setup()
  const parent = (await app.post()).data.comment
  const token = await app.login()
  assert.ok(token)
  const reply1 = await app.request('POST', { path: PATH, parentId: parent.id, content: '站长回复' }, { token })
  assert.equal(reply1.status, 201)
  assert.equal(reply1.data.comment.author, '舒一笑不秃头')
  assert.equal(reply1.data.comment.isAuthor, true)
  app.advance(1000)
  const reply2 = await app.request('POST', { path: PATH, parentId: parent.id, content: '第二条回复' }, { token })
  const list = (await app.request()).data
  assert.equal(list.comments[0].replies.length, 2)
  assert.equal(list.comments[0].replies[0].id, reply1.data.comment.id)
  assert.equal(app.mails.length, 1)
  assert.equal((await app.request('POST', { path: PATH, parentId: reply2.data.comment.id, content: '不可嵌套' }, { token })).status, 400)
  assert.equal((await app.request('POST', { path: '/articles/other', parentId: parent.id, content: '不可跨页' }, { token })).status, 400)
  assert.equal((await app.request('DELETE', { path: PATH, id: parent.id }, { token })).status, 200)
  assert.equal((await app.request()).data.total, 0)
})
test('reply to and delete legacy comment without removing original key', async () => {
  const app = setup()
  await app.commentStore.setJSON('articles/comments-test.html', [{ id: 7, author: '旧昵称', content: '旧评论', timestamp: '2025-01-01' }, { id: 8, author: '另一人', content: '保留', timestamp: '2025-01-02' }])
  const token = await app.login()
  assert.equal((await app.request('POST', { path: PATH, parentId: 'legacy:7', content: '回复旧评论' }, { token })).status, 201)
  await app.request('DELETE', { path: PATH, id: 'legacy:7' }, { token })
  assert.deepEqual((await app.commentStore.get('articles/comments-test.html')).map(row => row.id), [8])
  assert.equal((await app.request()).data.total, 1)
})
test('auth failures and missing configuration fail closed', async () => {
  const app = setup()
  assert.equal((await app.request('DELETE', { path: PATH, id: 'x' })).status, 401)
  assert.equal((await app.post({}, { token: 'invalid' })).status, 401)
  assert.equal((await setup({}).request('POST', { password: '' }, { login: true })).status, 503)
  assert.equal((await setup({}).post()).status, 503)
  const token = await app.login(); app.advance(43200001)
  assert.equal((await app.request('DELETE', { path: PATH, id: 'x' }, { token })).status, 401)
})
test('rate limiting: two per minute, twenty per day, hashed IP storage', async () => {
  const app = setup()
  assert.equal((await app.post()).status, 201)
  assert.equal((await app.post()).status, 201)
  assert.equal((await app.post()).status, 429)
  app.advance(60000)
  for (let i = 2; i < 20; i++) { assert.equal((await app.post()).status, 201); app.advance(60000) }
  assert.equal((await app.post()).status, 429)
  assert.ok(![...app.metaStore.data.keys()].some(key => key.includes('198.51.100.3')))
  assert.equal((await app.post({}, { ip: 'different' })).status, 201)
})
test('context.ip takes precedence over headers', async () => {
  const app = setup()
  for (let i = 0; i < 2; i++) assert.equal((await app.post({}, { ip: `different-${i}`, context: { ip: 'same' } })).status, 201)
  assert.equal((await app.post({}, { ip: 'other', context: { ip: 'same' } })).status, 429)
})
test('five login failures lock further attempts for the fifteen-minute window', async () => {
  const app = setup()
  for (let i = 0; i < 5; i++) assert.equal((await app.request('POST', { password: 'wrong' }, { login: true })).status, 401)
  assert.equal((await app.request('POST', { password: ENV.ADMIN_PASSWORD }, { login: true })).status, 429)
  app.advance(900000)
  assert.equal((await app.request('POST', { password: ENV.ADMIN_PASSWORD }, { login: true })).status, 200)
})
test('honeypot, absent timing and too-fast requests silently discard without counters or mail', async () => {
  const app = setup()
  for (const body of [{ hp: 'bot' }, { elapsedMs: 2999 }, { elapsedMs: null }]) {
    const result = await app.post(body)
    assert.equal(result.status, 200); assert.deepEqual(result.data, { success: true })
  }
  assert.equal(app.commentStore.data.size, 0)
  assert.equal(app.metaStore.data.size, 0)
  assert.equal(app.mails.length, 0)
})
test('errors expose only safe Chinese messages; invalid JSON and excessive bodies are 400', async () => {
  const app = setup()
  app.commentStore.list = async () => { throw new Error('secret stack test@example.com') }
  const result = await app.request()
  assert.equal(result.status, 500)
  assert.deepEqual(Object.keys(result.data), ['error'])
  assert.ok(!JSON.stringify(result.data).includes('stack'))
  for (const raw of ['{', 'null', '[]', 'x'.repeat(17000)]) {
    const response = await app.handler(new Request('https://example.test/api/comments', { method: 'POST', body: raw }))
    assert.equal(response.status, 400)
  }
  assert.equal((await app.request('PATCH', {})).status, 405)
  assert.equal((await app.request('OPTIONS')).status, 204)
  assert.equal((await app.request('GET', undefined, { path: '/about' })).status, 400)
})
test('mail failures do not change submission outcome and waitUntil is used', async () => {
  const app = setup()
  let background
  const handler = createHandler({ ...app, env: ENV, sendMail: async () => { throw new Error('smtp secret') } })
  const req = new Request('https://example.test/api/comments', { method: 'POST', body: JSON.stringify({ path: PATH, author: '访客', content: '新评论', elapsedMs: 4000 }) })
  assert.equal((await handler(req, { waitUntil: task => { background = task } })).status, 201)
  assert.ok(background instanceof Promise)
  await background
})
test('latest 300 record limit and cascade deletion beyond that limit', async () => {
  const app = setup()
  const parent = (await app.post()).data.comment
  for (let i = 0; i < 305; i++) {
    const id = `${app.now() + i + 1}-12345678`
    await app.commentStore.setJSON(`v2/${encodeURIComponent(PATH)}/${id}`, { ...parent, id, parentId: parent.id, isAuthor: true, createdAt: new Date(app.now() + i + 1).toISOString() })
  }
  const data = (await app.request()).data
  assert.equal(data.total, 306)
  assert.equal(data.truncated, true)
  const token = await app.login()
  assert.equal((await app.request('DELETE', { path: PATH, id: parent.id }, { token })).status, 200)
  assert.equal(app.commentStore.data.size, 0)
})
