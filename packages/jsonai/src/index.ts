import { craeteParse, ParseOptions } from './parse'
import { stringify } from './stringify'

const createJSON = (options?: ParseOptions) => ({
  parse: craeteParse(options),
  stringify,
})

export const json = createJSON()

export default createJSON
