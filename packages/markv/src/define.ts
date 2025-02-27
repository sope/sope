import { type Pluggable, type PluggableList } from 'unified'
import type { RemarkRehypeOptions } from './remark'

export const definePlugin = (v: Pluggable): Pluggable => v
export const definePlugins = (v: PluggableList): PluggableList => v

export const defineRemarkRehypeOptions = (
  v: RemarkRehypeOptions,
): RemarkRehypeOptions => v
