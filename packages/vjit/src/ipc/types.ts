export type ExtractRouteParams<T> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractRouteParams<Rest>
  : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : T extends `${string}*`
      ? {}
      : {}

export type Context<T> = {
  params: ExtractRouteParams<T>
  req: Request
  json: (data: unknown) => Response
}

type RouteHandler<T extends string> = (
  context: Context<T>,
) => Response | Promise<Response>

type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'

type RouteHandlerObject<T extends string> = {
  [K in HTTPMethod]?: RouteHandler<T>
}

export type RouteValue<T extends string> =
  | Response
  | false
  | RouteHandler<T>
  | RouteHandlerObject<T>
