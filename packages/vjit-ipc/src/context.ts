import {
  match,
  type MatchOptions,
  type ParseOptions,
  type Path,
} from 'path-to-regexp'
import type { Context, ExtractRouteParams } from './types'

export const createContext = <T extends string>(
  request: Request,
  path: Path | Path[],
  options?: MatchOptions & ParseOptions,
) => {
  const url = new URL(request.url)

  const route = match<ExtractRouteParams<T>>(path, options)(url.pathname)
  if (!route) {
    return false
  }

  const context: Context<T & string> = {
    req: request,
    params: route.params,
    json(data) {
      return Response.json(data)
    },
  }

  return context
}
