import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import '@nuxt/schema'
import type { Options } from './types'
import vite from './vite'
import webpack from './webpack'

export interface ModuleOptions extends Options {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-unplugin-vjit',
    configKey: 'unpluginVjit',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))

    // ...
  },
})
