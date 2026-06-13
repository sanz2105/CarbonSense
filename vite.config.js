import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

// Vite plugin: serves Vercel-style api/* handlers in local dev
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        // Strip query string to get the handler filename
        const urlPath = req.url.split('?')[0] // e.g. /api/gemini
        const handlerPath = path.resolve(
          process.cwd(),
          urlPath.slice(1) + '.js'  // -> api/gemini.js
        )

        let handler
        try {
          // Dynamic import with cache-bust so hot-reload works
          const mod = await import(
            pathToFileURL(handlerPath).href + '?t=' + Date.now()
          )
          handler = mod.default
        } catch (e) {
          console.error('[local-api] Failed to load handler:', e.message)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Handler not found: ' + handlerPath }))
          return
        }

        // Read raw body
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', async () => {
          const rawBody = Buffer.concat(chunks).toString()
          let parsedBody = {}
          try { parsedBody = JSON.parse(rawBody) } catch {}

          // Attach parsed body to req (mirrors Vercel behaviour)
          req.body = parsedBody

          // Build a minimal Vercel-compatible res wrapper
          const mockRes = {
            _status: 200,
            _headers: {},
            statusCode: 200,
            status(code) { this._status = code; this.statusCode = code; return this },
            setHeader(k, v) { this._headers[k] = v; res.setHeader(k, v); return this },
            getHeader(k) { return this._headers[k] },
            end(body) {
              res.statusCode = this._status
              res.end(body)
            },
            json(obj) {
              res.statusCode = this._status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(obj))
            },
            send(body) { this.end(body) }
          }

          try {
            await handler(req, mockRes)
          } catch (err) {
            console.error('[local-api] Handler error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  base: './',
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
    server: {
      deps: {
        inline: ['@testing-library/jest-dom']
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
