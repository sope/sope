import type { Element, Parents } from 'hast'
import type { Components } from 'hast-util-to-jsx-runtime'
import type { PluggableList } from 'unified'
import { RemarkRehypeOptions } from './define'

export type { Element, ElementContent } from 'hast'
export { type Components } from 'hast-util-to-jsx-runtime'

/**
 * Transform all URLs.
 * @param {string} url URL.
 * @param {string} key Property name (example: `'href'`).
 * @param {Readonly<Element>} node Node.
 * @returns {string | null | undefined} Transformed URL (optional).
 */
type UrlTransform = (url: string, key: string, node: Readonly<Element>) => string | null | undefined

// Extra fields we pass.
type ExtraProps = {
  //passed when `passNode` is on.
  node?: Element
}

// Whether to allow `element` (default: `false`).
type AllowElement = (
  // Filter elements.
  element: Readonly<Element>,
  // Element to check.
  index: number,
  // Index of `element` in `parent`.
  parent?: Readonly<Parents>,
) => // Parent of `element`.
boolean | null | undefined

// Configuration.
export type Options = {
  // Filter elements (optional);
  // `allowedElements` / `disallowedElements` is used first.
  allowElement?: AllowElement | null

  // Tag names to allow (default: all tag names);
  // cannot combine w/ `disallowedElements`.
  allowedElements?: ReadonlyArray<string> | null

  // Markdown.
  content?: string | null

  // Wrap in a `div` with this class name.
  class?: string | null

  // Map tag names to components.
  components?: Components | null

  // Tag names to disallow (default: `[]`);
  // cannot combine w/ `allowedElements`.
  disallowedElements?: ReadonlyArray<string> | null

  // List of rehype plugins to use.
  rehypePlugins?: PluggableList | null
  // List of remark plugins to use.
  remarkPlugins?: PluggableList | null

  // Options to pass through to `remark-rehype`.
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions> | null

  // Ignore HTML in markdown completely (default: `false`).
  skipHtml?: boolean | null

  // Extract (unwrap) what’s in disallowed elements (default: `false`);
  // normally when say `strong` is not allowed, it and it’s children are dro
  // with `unwrapDisallowed` the element itself is replaced by its children.
  unwrapDisallowed?: boolean | null

  // Change URLs (default: `defaultUrlTransform`)
  urlTransform?: UrlTransform
}
