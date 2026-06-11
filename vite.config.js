import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use "./" base only for production builds (needed for Vercel/static hosting).
  // Dev server must use "/" so Vite can resolve /src/main.jsx correctly.
  base: command === 'build' ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // In dev, proxy /api/gemini to the Vercel dev server (vercel dev runs on :3000)
      // Run `vercel dev` instead of `npm run dev` to use the AI features locally
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          router: ['react-router-dom'],
        },
      },
    },
  },
}))
