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
