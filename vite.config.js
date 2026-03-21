import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env file (ANTHROPIC_API_KEY without VITE_ prefix = server-side only)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        // Supabase REST API proxy
        '/rest': {
          target: 'http://178.104.103.37:8000',
          changeOrigin: true,
        },
        // Anthropic API proxy — solves CORS + hides API key
        '/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Inject API key server-side — never reaches the browser
              if (env.ANTHROPIC_API_KEY) {
                proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY)
              }
              proxyReq.setHeader('anthropic-version', '2023-06-01')
              // Remove browser origin header that Anthropic might reject
              proxyReq.removeHeader('origin')
            })
          }
        }
      }
    }
  }
})
