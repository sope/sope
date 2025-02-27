import { unreachable } from 'devlop'
import { type Nodes, type Root } from 'hast'
import { urlAttributes } from 'html-url-attributes'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit, type BuildVisitor } from 'unist-util-visit'
import { VFile } from 'vfile'
import { type Options } from './types'
import {
  defaultPlugins,
  defaultRemarkRehypeOptions,
  defaultUrlTransform,
} from './utils'

export const createAST = ({
  content,
  allowedElements,
  allowElement,
  disallowedElements,
  rehypePlugins,
  remarkPlugins,
  remarkRehypeOptions,
  skipHtml,
  unwrapDisallowed,
  urlTransform = defaultUrlTransform,
}: Options) => {
  const children = content
  rehypePlugins = defaultPlugins(rehypePlugins)
  remarkPlugins = defaultPlugins(remarkPlugins)
  remarkRehypeOptions = defaultRemarkRehypeOptions(remarkRehypeOptions)

  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins)

  const file = new VFile()

  if (typeof children === 'string') {
    file.value = children
  } else {
    unreachable(
      `Unexpected value \`${children}\` for \`children\` prop, expected \`string\``,
    )
  }

  if (allowedElements && disallowedElements) {
    unreachable(
      'Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other',
    )
  }

  const mdastTree = processor.parse(file)
  let hastTree: Nodes = processor.runSync(mdastTree, file)

  // Wrap in `div` if there’s a class name.
  // if (className) {
  //   hastTree = {
  //     type: 'element',
  //     tagName: 'div',
  //     properties: { className },
  //     // Assume no doctypes.
  //     children: (hastTree.type === 'root'
  //       ? hastTree.children
  //       : [hastTree]) as ElementContent[],
  //   }
  // }

  const transform: BuildVisitor<Root> = (node, index, parent) => {
    if (node.type === 'raw' && parent && typeof index === 'number') {
      if (skipHtml) {
        parent.children.splice(index, 1)
      } else {
        parent.children[index] = { type: 'text', value: node.value }
      }

      return index
    }

    if (node.type === 'element') {
      for (const key in urlAttributes) {
        if (
          Object.hasOwn(urlAttributes, key) &&
          Object.hasOwn(node.properties, key)
        ) {
          const value = node.properties[key]
          const test = urlAttributes[key]
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform(String(value || ''), key, node)
          }
        }
      }
    }

    if (node.type === 'element') {
      let remove = false

      if (allowedElements) {
        remove = !allowedElements.includes(node.tagName)
      } else if (disallowedElements) {
        remove = disallowedElements.includes(node.tagName)
      }

      if (!remove && allowElement && typeof index === 'number') {
        remove = !allowElement(node, index, parent)
      }

      if (remove && parent && typeof index === 'number') {
        if (unwrapDisallowed && node.children) {
          parent.children.splice(index, 1, ...node.children)
        } else {
          parent.children.splice(index, 1)
        }

        return index
      }
    }
  }

  visit(hastTree as Root, transform)

  return hastTree
}
