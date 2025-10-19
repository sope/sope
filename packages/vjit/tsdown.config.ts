import { defineConfig } from 'tsdown'

export default defineConfig({
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'esnext',
  minify: false,
  treeshake: true,
  sourcemap: false,
  entry: {
    core: 'src/core/index.ts',
    ipc: 'src/ipc/index.ts',
  },
})
