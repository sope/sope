import { type Pluggable, type PluggableList } from 'unified'
import { type Options } from 'remark-rehype'

export type RemarkRehypeOptions = Options
export const definePlugin = (v: Pluggable): Pluggable => v
export const definePlugins = (v: PluggableList): PluggableList => v
export const defineRemarkRehypeOptions = (
  v: RemarkRehypeOptions
): RemarkRehypeOptions => v

const emptyPlugins: PluggableList = []

export const defaultPlugins = (plugins?: PluggableList | null) => {
  return plugins || emptyPlugins
}
