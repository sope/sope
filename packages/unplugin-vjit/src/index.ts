import { rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createUnplugin, type UnpluginFactory } from 'unplugin'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options,
) => ({
  name: 'unplugin-vjit',
  vite: {
    config(config, env) {
      if (env.mode !== 'production') {
        return
      }
      if (!config.build) {
        config.build = {}
      }
      config.build.modulePreload = false
      config.build.manifest = true

      if (!config.server) {
        config.server = {}
      }
      if (!config.server.headers) {
        config.server.headers = {}
      }
      config.server.headers['access-control-allow-origin'] = '*'
    },
    writeBundle(options, bundle) {
      const dir = options.dir!

      for (const filename in bundle) {
        if (filename.endsWith('.css')) {
          rmSync(path.resolve(dir), { force: true, recursive: true })
          this.error('css')
        }
        if (filename.endsWith('manifest.json')) {
          const asset = bundle[filename] as { source: string }
          const f = JSON.parse(asset.source)['index.html'].file
          const content = `import('./${f}'+(new URL(import.meta.url)).search)`
          const output = path.resolve(dir, 'index.js')
          writeFileSync(output, content)
        }
      }
      rmSync(path.resolve(dir, 'index.html'))
      rmSync(path.resolve(dir, '.vite'), { force: true, recursive: true })
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
