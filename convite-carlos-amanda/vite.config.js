import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' deixa o site funcionar em qualquer hospedagem/subpasta
export default defineConfig({
  base: './',
  plugins: [vue()]
})
