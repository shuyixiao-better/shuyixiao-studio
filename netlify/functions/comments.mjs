import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import nodemailer from 'nodemailer'
import { normalizePath, validateComment } from '../../docs/.vitepress/theme/utils/comments-core.js'

export const config = { path: ['/api/comments', '/api/comments/admin-login'] }
const AUTHOR = '舒一笑不秃头'
const MAX_READ = 300
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })
const fail = (error, status) => json({ error }, status)
const hmac = (data, secret) => createHmac('sha256', secret).update(data).digest('base64url')
const equal = (a, b) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())
export const getSecret = env => env.COMMENT_SECRET || (env.ADMIN_PASSWORD ? hmac(env.ADMIN_PASSWORD, 'comments-secret-v1') : '')

export function signToken(secret, now = Date.now()) {
  const exp = now + 12 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp })).toString('base64url')
  return { token: `${payload}.${hmac(payload, secret)}`, expiresAt: exp }
}
export function verifyToken(token, secret, now = Date.now()) {
  if (!secret || typeof token !== 'string' || token.length > 2048) return false
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined || !equal(signature, hmac(payload, secret))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.role === 'admin' && Number.isFinite(data.exp) && data.exp > now && data.exp <= now + 12 * 60 * 60 * 1000
  } catch { return false }
}
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export function notification(comment) {
  const url = `https://www.poeticcoder.com${comment.path}?admin=1#评论区`
  return {
    subject: '博客收到新评论',
    text: `文章：${comment.path}\n昵称：${comment.author}\n时间：${comment.createdAt}\n${comment.content}\n查看并管理：${url}`,
    html: `<p>文章：${escapeHtml(comment.path)}</p><p>昵称：${escapeHtml(comment.author)}</p><p>时间：${escapeHtml(comment.createdAt)}</p><div style="white-space: pre-wrap">${escapeHtml(comment.content)}</div><p><a href="${escapeHtml(url)}">查看并管理</a></p>`
  }
}
const prefixFor = path => `v2/${encodeURIComponent(path)}/`
const validId = id => typeof id === 'string' && /^\d{13}-[a-f0-9]{8}$/.test(id)
const publicComment = c => ({ id: String(c.id), path: c.path, parentId: c.parentId ?? null, author: String(c.author ?? ''), content: String(c.content ?? ''), isAuthor: c.isAuthor === true, createdAt: c.createdAt })
const legacyKeys = path => [...new Set([path.slice(1), `${path.slice(1)}.html`, ...(path.endsWith('/') ? [`${path.slice(1)}index`, `${path.slice(1)}index.html`] : [])])]
const safeDate = value => Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : new Date(0).toISOString()
const dateOrder = (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id.localeCompare(b.id)

async function readLegacy(store, path) {
  const sources = await Promise.all(legacyKeys(path).map(async key => ({ key, rows: await store.get(key, { type: 'json' }) })))
  const merged = new Map()
  for (const { rows } of sources) {
    if (!Array.isArray(rows)) continue
    for (const row of rows) {
      if (!row || row.id == null) continue
      const id = `legacy:${row.id}`
      merged.set(id, { id, path, parentId: null, author: String(row.author ?? ''), content: String(row.content ?? ''), isAuthor: false, createdAt: safeDate(row.timestamp) })
    }
  }
  return { sources, comments: [...merged.values()] }
}
async function listKeys(store, path) {
  const { blobs } = await store.list({ prefix: prefixFor(path) })
  return blobs.map(blob => blob.key).sort().reverse()
}
async function readKeys(store, keys) {
  const rows = []
  // Bound storage concurrency independently of the result limit.
  for (let i = 0; i < keys.length; i += 20) rows.push(...await Promise.all(keys.slice(i, i + 20).map(key => store.get(key, { type: 'json' }))))
  return rows.filter(Boolean).map(publicComment)
}
async function findParent(store, path, id) {
  if (typeof id !== 'string') return null
  if (id.startsWith('legacy:')) return (await readLegacy(store, path)).comments.find(row => row.id === id) ?? null
  if (!validId(id)) return null
  const row = await store.get(prefixFor(path) + id, { type: 'json' })
  return row && row.path === path && !row.parentId ? publicComment(row) : null
}
async function boundedMail(sendMail, comment) {
  let timer
  try {
    await Promise.race([
      Promise.resolve().then(() => sendMail(notification(comment))),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 5000) })
    ])
  } catch { console.warn('comments: 邮件通知未完成') } finally { clearTimeout(timer) }
}

export function createHandler({ commentStore, metaStore, sendMail = async () => {}, env = {}, now = Date.now }) {
  const secret = getSecret(env)
  const ipHash = (req, context) => hmac(String(context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown'), secret)
  async function rateLimit(hash, timestamp) {
    for (const [duration, limit] of [[60000, 2], [86400000, 20]]) {
      const key = `rl/${hash}/${Math.floor(timestamp / duration) * duration}`
      const state = await metaStore.get(key, { type: 'json' }) || {}
      if ((state[duration] || 0) >= limit) return false
    }
    for (const duration of [60000, 86400000]) {
      const key = `rl/${hash}/${Math.floor(timestamp / duration) * duration}`
      const state = await metaStore.get(key, { type: 'json' }) || {}
      await metaStore.setJSON(key, { ...state, [duration]: (state[duration] || 0) + 1 })
    }
    return true
  }
  return async (req, context = {}) => {
    try {
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
      const url = new URL(req.url)
      const login = url.pathname === '/api/comments/admin-login'
      if ((login && req.method !== 'POST') || (!login && !['GET', 'POST', 'DELETE'].includes(req.method))) return fail('不支持的请求方法', 405)
      const timestamp = Number(now())
      let body = {}
      if (req.method !== 'GET') {
        // Plain text comments never need a multi-megabyte request.
        const raw = await req.text()
        if (Buffer.byteLength(raw) > 16384) return fail('请求内容过长', 400)
        try { body = JSON.parse(raw) } catch { return fail('请求格式无效', 400) }
        if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('请求格式无效', 400)
      }
      if (login) {
        if (!env.ADMIN_PASSWORD) return fail('管理登录暂未配置', 503)
        const key = `login/${ipHash(req, context)}/${Math.floor(timestamp / 900000) * 900000}`
        const count = await metaStore.get(key, { type: 'json' }) || 0
        if (count >= 5) return fail('登录尝试过于频繁，请 15 分钟后再试', 429)
        if (typeof body.password !== 'string' || !equal(body.password, env.ADMIN_PASSWORD)) {
          await metaStore.setJSON(key, count + 1)
          return fail('密码错误', 401)
        }
        await metaStore.delete(key)
        return json(signToken(secret, timestamp))
      }
      let path
      try { path = normalizePath(req.method === 'GET' ? url.searchParams.get('path') : body.path) } catch (error) { return fail(error.message, 400) }
      const authorization = req.headers.get('authorization')
      const admin = authorization !== null || req.method === 'DELETE'
      if (admin && (!env.ADMIN_PASSWORD || !verifyToken(authorization?.replace(/^Bearer /, ''), secret, timestamp) || !authorization?.startsWith('Bearer '))) return fail('管理登录已过期，请重新登录', 401)
      if (req.method === 'GET') {
        const [keys, legacy] = await Promise.all([listKeys(commentStore, path), readLegacy(commentStore, path)])
        const rows = [...await readKeys(commentStore, keys.slice(0, MAX_READ)), ...legacy.comments]
        const selected = rows.sort(dateOrder).reverse().slice(0, MAX_READ)
        const comments = selected.filter(row => !row.parentId).map(row => ({ ...row, replies: selected.filter(reply => reply.parentId === row.id).sort(dateOrder) }))
        return json({ comments, total: keys.length + legacy.comments.length, truncated: keys.length + legacy.comments.length > MAX_READ })
      }
      if (req.method === 'DELETE') {
        const id = body.id
        let target
        if (typeof id === 'string' && id.startsWith('legacy:')) {
          const legacy = await readLegacy(commentStore, path)
          target = legacy.comments.find(row => row.id === id)
          if (target) for (const { key, rows } of legacy.sources) {
            if (Array.isArray(rows) && rows.some(row => `legacy:${row.id}` === id)) await commentStore.setJSON(key, rows.filter(row => `legacy:${row.id}` !== id))
          }
        } else if (validId(id)) {
          target = await commentStore.get(prefixFor(path) + id, { type: 'json' })
        }
        if (!target) return fail('评论不存在', 404)
        // Scan every record for cascade deletion, even beyond the public 300-record limit.
        const keys = await listKeys(commentStore, path)
        for (let i = 0; i < keys.length; i += 20) {
          await Promise.all(keys.slice(i, i + 20).map(async key => {
            const row = await commentStore.get(key, { type: 'json' })
            if (row && (row.id === id || row.parentId === id)) await commentStore.delete(key)
          }))
        }
        return json({ success: true })
      }
      if (!admin && ((body.hp != null && body.hp !== '') || !Number.isFinite(body.elapsedMs) || body.elapsedMs < 3000)) return json({ success: true })
      const validated = validateComment(body, { isAuthor: admin })
      if (validated.error) return fail(validated.error, 400)
      if (admin) {
        if (!await findParent(commentStore, path, body.parentId)) return fail('只能回复本页已有的顶层评论', 400)
      } else {
        if (!secret) return fail('评论服务暂未配置', 503)
        if (!await rateLimit(ipHash(req, context), timestamp)) return fail('评论太频繁，请稍后再试', 429)
      }
      const comment = { id: `${String(timestamp).padStart(13, '0')}-${randomUUID().slice(0, 8)}`, path, parentId: admin ? body.parentId : null, author: admin ? AUTHOR : validated.author, content: validated.content, isAuthor: admin, createdAt: new Date(timestamp).toISOString() }
      await commentStore.setJSON(prefixFor(path) + comment.id, comment)
      if (!admin) {
        const work = boundedMail(sendMail, comment)
        if (typeof context.waitUntil === 'function') {
          try { context.waitUntil(work) } catch { await work }
        } else await work
      }
      return json({ success: true, comment }, 201)
    } catch (error) {
      // Never log request data, credentials, provider messages or stack traces.
      console.warn(`comments: ${error instanceof SyntaxError ? 'SyntaxError' : 'StorageOrServiceError'}，请求处理失败`)
      return fail('评论服务暂时不可用，请稍后重试', 500)
    }
  }
}

let transporter
async function sendMail(mail) {
  const env = process.env
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.ADMIN_EMAIL) {
    console.warn('comments: 邮件配置不完整，跳过通知')
    return
  }
  const port = Number(env.SMTP_PORT || 465)
  transporter ||= nodemailer.createTransport({ host: env.SMTP_HOST, port, secure: port === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }, connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 5000 })
  await transporter.sendMail({ ...mail, from: env.SMTP_USER, to: env.ADMIN_EMAIL })
}
export default async (req, context) => {
  // Resolve stores inside the invocation so Netlify's per-request Blobs context is available.
  try {
    return await createHandler({ commentStore: getStore({ name: 'comments', consistency: 'strong' }), metaStore: getStore({ name: 'comments-meta', consistency: 'strong' }), sendMail, env: process.env })(req, context)
  } catch {
    console.warn('comments: StorageConfigurationError，请求处理失败')
    return fail('评论服务暂时不可用，请稍后重试', 500)
  }
}
