import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Use '/chuckwalla/' for GitHub Pages, '/' for local development
  base: process.env.NODE_ENV === 'production' ? '/chuckwalla/' : '/',
  build: {
    outDir: 'dist',
  }
})
