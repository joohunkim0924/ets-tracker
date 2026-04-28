import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // This tells Vite: "Don't restart if THESE files change"
      // It ignores the hidden git, cache, and node folders
      ignored: ['**/node_modules/**', '**/.vite/**', '**/.git/**'],
      usePolling: true,
      interval: 1000,
    },
  },
})