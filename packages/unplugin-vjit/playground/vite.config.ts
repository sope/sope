import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import unplugin from '../src/vite'

export default defineConfig({
  plugins: [inspect(), unplugin()],
})
