import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
    },
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: `sonner-ts.js`,
          preserveModules: false,
        },
      ],
    },
  },
})
