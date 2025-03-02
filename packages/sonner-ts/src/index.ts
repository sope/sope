import type { Plugin } from 'vue'
import { Toaster } from './component'
import { useVueSonner } from './hooks'
import { toast } from './state'
import './styles.css'

import type {
  Action,
  ExternalToast,
  ToastClasses,
  ToasterProps,
  ToastT,
  ToastToDismiss,
} from './types'

export {
  toast,
  Toaster,
  useVueSonner,
  type Action,
  type ExternalToast,
  type ToastClasses,
  type ToasterProps,
  type ToastT,
  type ToastToDismiss,
}

const plugin: Plugin = {
  install(app) {
    app.component('Toaster', Toaster)
  },
}

export default plugin
