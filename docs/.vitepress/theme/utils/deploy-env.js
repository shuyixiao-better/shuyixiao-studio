/** Multi-platform capabilities. Keep host mapping in this module only. */
export const PRIMARY_ORIGIN = 'https://www.poeticcoder.com'
const HOSTS = { netlify: ['poeticcoder.com', 'netlify.app'], cloudflare: ['shuyixiao.cn', 'pages.dev'], github: ['poeticcoder.cn', 'github.io'] }
export function resolveDeployTarget(hostname = '') {
  const host = hostname.toLowerCase().replace(/\.$/, '')
  if (host === 'localhost' || host === '127.0.0.1') return 'local'
  for (const [target, domains] of Object.entries(HOSTS)) {
    if (domains.some(domain => host === domain || host.endsWith('.' + domain))) return target
  }
  return 'unknown'
}
export function getDeployTarget() {
  if (typeof window === 'undefined') return 'unknown'
  const target = resolveDeployTarget(window.location.hostname)
  const override = new URLSearchParams(window.location.search).get('__deploy')
  return target === 'local' && ['netlify', 'cloudflare', 'github'].includes(override) ? override : target
}
let probe
export async function hasBackend() {
  if (typeof window === 'undefined') return false
  const target = getDeployTarget()
  if (target === 'netlify') return true
  if (target === 'cloudflare' || target === 'github') return false
  if (probe) return probe
  const key = 'deploy-backend:' + window.location.origin
  try {
    const cached = window.sessionStorage.getItem(key)
    if (cached === 'true' || cached === 'false') return cached === 'true'
  } catch { /* Storage may be disabled. */ }
  probe = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    let available = false
    try {
      const response = await fetch('/api/check-env', { method: 'GET', signal: controller.signal })
      available = response.status === 200 && (response.headers.get('content-type') || '').includes('application/json')
    } catch { /* Static hosts and offline clients have no backend. */ }
    finally { clearTimeout(timer) }
    try { window.sessionStorage.setItem(key, String(available)) } catch { /* Optional cache. */ }
    return available
  })()
  return probe
}
export function primaryUrl(path = '/') {
  // A route can never replace the canonical origin.
  return PRIMARY_ORIGIN + '/' + String(path).replace(/^\/+/, '')
}
