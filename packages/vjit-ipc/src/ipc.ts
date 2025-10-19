import { EventChannel, generateId } from 'vjit-core'
import { createContext } from './context'
import { RouteValue } from './types'

type Fetch = (req: Request) => Response | Promise<Response>

const serve = <R>(fetch: Fetch, routes?: R) => {
  return (request: Request) => {
    for (const [path, value] of Object.entries((routes ?? {}) as object)) {
      if (value instanceof Response) {
        return value
      }
      if (value === false) {
        return
      }

      const context = createContext(request, path)

      if (context) {
        if (typeof value === 'object') {
          for (const [method, handler] of Object.entries(value as object)) {
            if (request.method.toLowerCase() === method.toLowerCase()) {
              return handler(context)
            }
          }
        }

        if (typeof value === 'function') {
          return value(context)
        }
      }
    }

    return fetch(request)
  }
}

export class Ipc implements Disposable {
  private id: string
  private request: EventChannel
  private response: EventChannel

  private disposableStack: DisposableStack = new DisposableStack()

  constructor(namespace = generateId(16)) {
    this.id = generateId(16)

    this.request = new EventChannel(`${namespace}:request`)
    this.response = new EventChannel(`${namespace}:response`)

    this.disposableStack.use(this.request)
    this.disposableStack.use(this.response)
  }

  dispose() {
    this.disposableStack.dispose()
  }

  [Symbol.dispose](): void {
    this.disposableStack.dispose()
  }

  fetch(input: RequestInfo | URL, init?: RequestInit) {
    return this.invoke(input, init)
  }

  serve<R extends { [K in keyof R]: RouteValue<K & string> }>({
    routes,
    fetch = async () => {
      return new Response('Not Found', { status: 404 })
    },
  }: {
    routes?: R
    fetch?: (req: Request) => Response | Promise<Response>
  }) {
    return this.handle(serve(fetch, routes))
  }

  private handle(fn: (req: Request) => Response | Promise<Response>) {
    this.request.on(this.id, async (e: Event) => {
      const request = (e as CustomEvent<Request>).detail
      const id = request.headers.get('x-request-id') as string

      const response = await fn(request)

      if (response instanceof Response) {
        this.response.emit(id, response)
      } else {
        throw new TypeError('The return value must be a Response')
      }
    })
  }

  private invoke(input: RequestInfo | URL, init?: RequestInit) {
    const { promise, resolve } = Promise.withResolvers<Response>()

    const id = generateId(16)

    this.response.once(id, (e) => resolve((e as CustomEvent<Response>).detail))

    const req = new Request(input, init)
    req.headers.set('x-request-id', id)

    this.request.emit(this.id, req)

    return promise
  }
}
