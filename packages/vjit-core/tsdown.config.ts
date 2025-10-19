import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'esnext',
  minify: false,
  treeshake: true,
  sourcemap: false,
})
