import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Root directory for Vite
  build: {
    outDir: 'dist', // Output folder for build files
    rollupOptions: {
      input: './index.html', // Entry point for Vite
    },
  },
})