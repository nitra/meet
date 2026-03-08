import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  oxc: {
    include: /\.[jt]sx?$/
  },
  plugins: [
    vue({ include: /\.vue$/, enforce: 'pre' }),
    VueRouter({
      dts: 'src/route-map.d.ts',
      routesFolder: 'src/pages'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    sourcemap: true
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js', 'src/**/*.test.js']
  }
})
