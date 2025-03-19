import { DisposableStack } from '@whatwg-node/disposablestack'

export class EventChannel implements Disposable {
  private namespace: string
  private host: Element
  private disposeableStack: DisposableStack = new DisposableStack()

  constructor(namespace: string) {
    this.host = document as Node as Element
    this.namespace = namespace
  }

  dispose() {
    this[Symbol.dispose]()
  }

  [Symbol.dispose](): void {
    this.disposeableStack.dispose()
  }

  type(name: string) {
    return `${this.namespace}:${name}`
  }

  on(
    name: string,
    fn: (e: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    const type = this.type(name)

    this.host.addEventListener(type, fn, options)

    if (typeof options === 'object' && options.once) {
      return
    }

    this.disposeableStack.defer(() => {
      this.host.removeEventListener(type, fn)
    })
  }

  once(name: string, fn: (e: Event) => void) {
    return this.on(name, fn, { once: true })
  }

  emit<T = unknown>(name: string, data?: T) {
    const event = createEvent(this.type(name), data)
    this.host.dispatchEvent(event)
  }
}

export const createEvent = <T = unknown>(name: string, data: T) => {
  return new CustomEvent(name, {
    detail: data,
    bubbles: true,
    cancelable: true,
  })
}
