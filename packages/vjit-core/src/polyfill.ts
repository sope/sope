import {
  AsyncDisposableStack,
  DisposableStack,
  SuppressedError,
  patchSymbols,
} from '@whatwg-node/disposablestack'

if (typeof globalThis.DisposableStack === 'undefined') {
  patchSymbols()
  globalThis.DisposableStack = DisposableStack
}
if (typeof globalThis.AsyncDisposableStack === 'undefined') {
  globalThis.AsyncDisposableStack = AsyncDisposableStack
}
if (typeof globalThis.SuppressedError === 'undefined') {
  globalThis.SuppressedError = SuppressedError
}

if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = <T>() => {
    let resolve: ((value: T | PromiseLike<T>) => void) | undefined
    let reject: ((reason?: any) => void) | undefined
    const promise = new Promise<T>((rs, rj) => {
      resolve = rs
      reject = rj
    })
    while (resolve === undefined || reject === undefined) {}

    return { promise, resolve, reject }
  }
}
