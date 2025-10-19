import { defineConfig } from 'tsdown'

export default defineConfig({
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'esnext',
  minify: false,
  treeshake: true,
  // splitting: true,
  sourcemap: true,
  entry: ['src/index.ts'],
})
