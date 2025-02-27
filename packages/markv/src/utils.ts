import { type Options as RemarkRehypeOptions } from 'remark-rehype'
import type { PluggableList } from 'unified'

const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i

/**
 * Make a URL safe.
 *
 * @satisfies {UrlTransform}
 * @param {string} value
 *   URL.
 * @returns {string}
 *   Safe URL.
 */
export function defaultUrlTransform(value: string): string {
  // Same as:
  // <https://github.com/micromark/micromark/blob/929275e/packages/micromark-util-sanitize-uri/dev/index.js#L34>
  // But without the `encode` part.
  const colon = value.indexOf(':')
  const questionMark = value.indexOf('?')
  const numberSign = value.indexOf('#')
  const slash = value.indexOf('/')

  if (
    // If there is no protocol, it’s relative.
    colon === -1 ||
    // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    // It is a protocol, it should be allowed.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value
  }

  return ''
}

const emptyPlugins: PluggableList = []

const emptyRemarkRehypeOptions: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
}

export const defaultRemarkRehypeOptions = (
  options?: Readonly<RemarkRehypeOptions> | null,
) => {
  return options
    ? { ...options, ...emptyRemarkRehypeOptions }
    : emptyRemarkRehypeOptions
}

export const defaultPlugins = (plugins?: PluggableList | null) => {
  return plugins || emptyPlugins
}
