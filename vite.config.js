import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".", // Root directory for Vite
  build: {
    outDir: "dist", // Output folder for build files
    emptyOutDir: true, // Clean output directory before build
    rollupOptions: {
      input: "./index.html", // Entry point for Vite
    },
    sourcemap: false,
  },
  server: {
    open: true, // Automatically opens the browser on dev server start
    hmr: {
      overlay: false, // Disable the full-screen error overlay
    },
    watch: {
      usePolling: true, // Enables polling to pick up file changes
      interval: 100,    // Polling interval in milliseconds
    },
  },
})
