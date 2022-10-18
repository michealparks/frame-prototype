import { defineConfig } from 'vite'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['.'],
      strict: true,
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    strictPort: true,
  },
  define,
})
