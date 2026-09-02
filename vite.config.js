import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    vue(),
    cloudflare()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true
  },

  server: {
    port: 5173,
    host: true
  }
})
