import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { defineComponent } from 'vue'
import { Fragment, jsx, jsxs } from 'vue/jsx-runtime'
import { createAST } from './ast'
import { type Options } from './types'

/**
 * Component to render markdown.
 */
export const Markdown = defineComponent<Options>({
  name: 'Markdown',
  props: [
    'class',
    'content',
    'allowedElements',
    'allowElement',
    'components',
    'disallowedElements',
    'rehypePlugins',
    'remarkPlugins',
    'remarkRehypeOptions',
    'skipHtml',
    'unwrapDisallowed',
    'urlTransform',
  ],
  setup({ components, ...props }) {
    return () => {
      const tree = createAST(props)
      return toJsxRuntime(tree, {
        Fragment,
        components,
        ignoreInvalidStyle: true,
        elementAttributeNameCase: 'html',
        jsx,
        jsxs,
        passKeys: true,
        passNode: true,
      })
    }
  },
})
