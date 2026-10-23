// Shared by the browser and the Netlify function. Keep this module platform independent.
const ALLOWED = /^\/(articles|tutorials|insights|series|interview|projects)\//
const RESERVED = ['舒一笑不秃头', '站长', '博主', '作者', 'admin']

export function normalizePath(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('文章路径无效')
  let path
  try { path = decodeURI(input.trim()).split(/[?#]/, 1)[0] } catch { throw new Error('文章路径无效') }
  if (/[\\\u0000-\u0020]/.test(path) || /%2f|%5c|%2e/i.test(path)) throw new Error('文章路径无效')
  path = '/' + path.replace(/^\/+/, '').replace(/\/{2,}/g, '/')
  path = path.replace(/\.html$/, '').replace(/\/index\/?$/, '/')
  if (path.split('/').some(part => part === '.' || part === '..') || !ALLOWED.test(path)) throw new Error('该页面不支持评论')
  return path
}

export function isReservedName(author) {
  const name = String(author ?? '').replace(/\s/g, '').toLowerCase()
  return RESERVED.some(word => name.includes(word))
}

export function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g, '').replace(/\n{3,}/g, '\n\n').trim() : ''
}

export function validateComment(input = {}, { isAuthor = false } = {}) {
  const author = cleanText(input.author)
  const content = cleanText(input.content)
  if (!isAuthor && (author.length < 1 || author.length > 20)) return { error: '昵称须为 1–20 个字符' }
  if (!isAuthor && isReservedName(author)) return { error: '该昵称为保留昵称' }
  if (content.length < 2 || content.length > 500) return { error: '评论须为 2–500 个字符' }
  if ((content.match(/https?:\/\//gi) || []).length > 2) return { error: '评论最多包含 2 个链接' }
  return { author, content }
}

export function linkify(value) {
  const text = String(value ?? '')
  const parts = []
  // HTML delimiters end URLs; Vue interpolates every non-link fragment as text.
  const pattern = /https?:\/\/[^\s<>"'`，。！？；：、]+/gi
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index && /[\w:]/.test(text[match.index - 1])) continue
    const url = match[0].replace(/[.,!?:;，。！？；：)\]）]+$/, '')
    if (!/^https?:\/\/[^/\s]+/i.test(url)) continue
    if (match.index > cursor) parts.push({ type: 'text', value: text.slice(cursor, match.index) })
    parts.push({ type: 'link', value: url })
    cursor = match.index + url.length
  }
  if (cursor < text.length) parts.push({ type: 'text', value: text.slice(cursor) })
  return parts
}

export function shouldShowComments({ path = '', relativePath = '', frontmatter = {}, layout = frontmatter.layout ?? 'doc' } = {}) {
  if (layout !== 'doc' || /^\/tools\/pandacoder-weekly(?:\/|\.|$)/.test(path)) return false
  if (typeof frontmatter.comments === 'boolean') return frontmatter.comments
  try { return ALLOWED.test(normalizePath(path)) && !/(^|\/)index\.md$/i.test(relativePath) } catch { return false }
}
