import { type Options as RemarkRehypeOptions } from 'remark-rehype'

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
  return value
}

const emptyRemarkRehypeOptions: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
}

export const defaultRemarkRehypeOptions = (
  options?: Readonly<RemarkRehypeOptions> | null
) => {
  return options
    ? { ...options, ...emptyRemarkRehypeOptions }
    : emptyRemarkRehypeOptions
}
