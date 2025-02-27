import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { createUnplugin, type UnpluginFactory } from 'unplugin'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options,
) => ({
  name: 'unplugin-tailwindcss',
  vite: {
    config(config, env) {
      if (!config.css) {
        config.css = {}
      }
      if (!config.css.postcss) {
        config.css.postcss = {}
      }
      if (typeof config.css.postcss === 'object') {
        if (!config.css.postcss.plugins) {
          config.css.postcss.plugins = []
        }

        config.css.postcss.plugins.push(tailwindcss)
        config.css.postcss.plugins.push(autoprefixer)
      }
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
