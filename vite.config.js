import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: './',
    base: '/',
  build: {
    chunkSizeWarningLimit: 2500,
  },
  server: {
            port: 3000,
        },
})