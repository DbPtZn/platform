import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_ASSETS_BASE,
    plugins: [
      vue(),
      Components({
        extensions: ['vue'],
        resolvers: [NaiveUiResolver()],
        // 可以指定放置类型声明文件的位置和名称
        dts: 'src/types/components.d.ts'
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // 路径别名
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '@/assets/styles/var.scss' as *;"
        }
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      port: Number(env.VITE_DEV_PORT),
      strictPort: true,
    }
  }
})
