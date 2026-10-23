import { ref, onMounted, onBeforeUnmount } from 'vue'

const SESSION_KEY = 'comments-admin-session'
export function useComments(path) {
  const comments = ref([])
  const total = ref(0)
  const truncated = ref(false)
  const status = ref('idle')
  const adminMode = ref(false)
  const token = ref('')
  const message = ref('')
  const highlighted = ref('')
  let storage, expiration, highlightTimer, alive = true
  const controllers = new Set()
  const submitted = new Map()
  function logout() {
    token.value = ''
    clearTimeout(expiration)
    try { storage?.removeItem(SESSION_KEY) } catch { /* Optional storage. */ }
  }
  function restore(session) {
    if (typeof session?.token !== 'string' || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) { logout(); return }
    token.value = session.token
    expiration = setTimeout(logout, Math.min(session.expiresAt - Date.now(), 43200000))
  }
  onMounted(() => {
    adminMode.value = new URLSearchParams(window.location.search).get('admin') === '1'
    if (!adminMode.value) return
    try { storage = window.sessionStorage; restore(JSON.parse(storage.getItem(SESSION_KEY))) } catch { logout() }
  })
  async function request(method, body, { login = false, authenticated = false } = {}) {
    const controller = new AbortController()
    controllers.add(controller)
    const timer = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(`/api/comments${login ? '/admin-login' : method === 'GET' ? `?path=${encodeURIComponent(path)}` : ''}`, {
        method, signal: controller.signal,
        headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(authenticated ? { Authorization: `Bearer ${token.value}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {})
      })
      let data
      try { data = await response.json() } catch { throw new Error('评论服务暂时不可用，请稍后重试') }
      if (response.status === 401) logout()
      if (!response.ok) throw new Error(response.status === 429 ? (login ? '登录尝试过于频繁，请稍后再试' : '评论太频繁，请稍后再试') : data.error || '评论服务暂时不可用，请稍后重试')
      return data
    } catch (error) {
      if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('网络连接失败，请稍后重试')
      throw error
    } finally { clearTimeout(timer); controllers.delete(controller) }
  }
  async function load() {
    status.value = 'loading'
    try {
      const data = await request('GET')
      if (!alive) return
      if (!Array.isArray(data.comments)) throw new Error('评论数据无效')
      const received = new Set(data.comments.map(comment => comment.id))
      const pending = [...submitted.values()].filter(comment => !received.has(comment.id))
      comments.value = [...pending, ...data.comments]
      total.value = data.total + pending.length
      truncated.value = data.truncated === true
      status.value = 'ready'
    } catch { if (alive) status.value = 'error' }
  }
  async function submit(input) {
    const data = await request('POST', { ...input, path })
    if (data.comment && alive) {
      const comment = { ...data.comment, replies: [] }
      submitted.set(comment.id, comment)
      comments.value.unshift(comment)
      if (status.value === 'error') status.value = 'ready'
      total.value++
      highlighted.value = data.comment.id
      clearTimeout(highlightTimer)
      highlightTimer = setTimeout(() => { highlighted.value = '' }, 1000)
    }
    return data
  }
  async function login(password) {
    const session = await request('POST', { password }, { login: true })
    restore(session)
    try { storage?.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* Session remains in memory. */ }
  }
  async function reply(parentId, content) {
    const data = await request('POST', { path, parentId, content }, { authenticated: true })
    const parent = comments.value.find(comment => comment.id === parentId)
    if (parent && data.comment) { parent.replies.push(data.comment); total.value++ }
  }
  async function remove(id) {
    await request('DELETE', { path, id }, { authenticated: true })
    submitted.delete(id)
    const target = comments.value.find(comment => comment.id === id)
    if (target) { total.value -= 1 + target.replies.length; comments.value = comments.value.filter(comment => comment.id !== id) }
    else for (const parent of comments.value) {
      const count = parent.replies.length
      parent.replies = parent.replies.filter(reply => reply.id !== id)
      total.value -= count - parent.replies.length
    }
  }
  onBeforeUnmount(() => {
    alive = false
    controllers.forEach(controller => controller.abort())
    clearTimeout(expiration)
    clearTimeout(highlightTimer)
  })
  return { comments, total, truncated, status, adminMode, token, message, highlighted, load, submit, login, logout, reply, remove }
}
