import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 代理中文网字计划 CDN
      '/font-cdn': {
        target: 'https://chinese-font.netlify.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/font-cdn/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})

