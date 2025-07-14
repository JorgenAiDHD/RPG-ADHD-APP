import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true
  },
  root: process.cwd(),
  // Conditionally set the base path for production builds
  // For GitHub Pages, use the repository name (RPG-ADHD-APP) as the base
  // For local development, use '/'
  base: process.env.NODE_ENV === 'production' ? '/RPG-ADHD-APP/' : '/',
})
