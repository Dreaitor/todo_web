import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 你的SpringBoot后端地址
        changeOrigin: true,             // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '/api') // 路径重写 （暂时没变）
      }
    }
  }
})