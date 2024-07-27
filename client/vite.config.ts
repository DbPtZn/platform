import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      extensions: ['vue'],
      resolvers: [NaiveUiResolver()],
      // 可以指定放置类型声明文件的位置和名称
      dts: 'src/types/components.d.ts'
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 路径别名
    }
  },
})
