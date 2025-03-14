import BigNumber from 'bignumber.js'
import { JSONArray, JSONObject, JSONValue } from './types'

// regexpxs extracted from
// (c) BSD-3-Clause
// https://github.com/fastify/secure-json-parse/graphs/contributors and https://github.com/hapijs/bourne/graphs/contributors

const suspectProtoRx =
  /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/
const suspectConstructorRx =
  /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/

/*
    json_parse.js
    2012-06-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This file creates a json_parse function.
    During create you can (optionally) specify some behavioural switches

        require('json-bigint')(options)

            The optional options parameter holds switches that drive certain
            aspects of the parsing process:
            * options.strict = true will warn about duplicate-key usage in the json.
              The default (strict = false) will silently ignore those and overwrite
              values for keys that are in duplicate use.

    The resulting function follows this signature:
        json_parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = json_parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*members "", "\"", "\/", "\\", at, b, call, charAt, f, fromCharCode,
    hasOwnProperty, message, n, name, prototype, push, r, t, text
*/

const escapee = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
}

export type ParseOptions = {
  strict?: boolean
  storeAsString?: boolean
  alwaysParseAsBig?: boolean
  useNativeBigInt?: boolean
  protoAction?: 'error' | 'ignore' | 'preserve'
  constructorAction?: 'error' | 'ignore' | 'preserve'
}

const defaultOptions: ParseOptions = {
  strict: false, // not being strict means do not generate syntax errors for "duplicate key"
  storeAsString: false, // toggles whether the values should be stored as BigNumber (default) or a string
  alwaysParseAsBig: false, // toggles whether all numbers should be Big
  useNativeBigInt: false, // toggles whether to use native BigInt instead of bignumber.js
  protoAction: 'error',
  constructorAction: 'error',
}

const defineOptions = (options?: ParseOptions) => {
  const _options = { ...defaultOptions }
  // If there are options, then use them to override the default _options
  if (options !== undefined && options !== null) {
    if (options.strict === true) {
      _options.strict = true
    }
    if (options.storeAsString === true) {
      _options.storeAsString = true
    }
    if (options.alwaysParseAsBig === true) {
      _options.alwaysParseAsBig = true
    }

    if (options.useNativeBigInt === true) {
      _options.useNativeBigInt = true
    }

    if (typeof options.constructorAction !== 'undefined') {
      if (
        options.constructorAction === 'error' ||
        options.constructorAction === 'ignore' ||
        options.constructorAction === 'preserve'
      ) {
        _options.constructorAction = options.constructorAction
      } else {
        throw new Error(
          `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`,
        )
      }
    }

    if (typeof options.protoAction !== 'undefined') {
      if (
        options.protoAction === 'error' ||
        options.protoAction === 'ignore' ||
        options.protoAction === 'preserve'
      ) {
        _options.protoAction = options.protoAction
      } else {
        throw new Error(
          `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`,
        )
      }
    }
  }

  return _options
}

// This is a function that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.
// We are defining the function inside of another function to avoid creating
// global variables.
// Default options one can override by passing options to the parse()
export const craeteParse = (options?: ParseOptions) => {
  const _options = defineOptions(options)

  // The index of the current character
  let at: number

  // The current character
  let ch: string | any

  let text: string

  // Call error when something is wrong.
  const error = (m: string) => {
    throw {
      name: 'SyntaxError',
      message: m,
      at,
      text,
    }
  }

  // If a c parameter is provided, verify that it matches the current character.
  const next = (c?: string) => {
    if (c && c !== ch) {
      error("Expected '" + c + "' instead of '" + ch + "'")
    }

    // Get the next character. When there are no more characters,
    // return the empty string.
    ch = text.charAt(at)
    at += 1
    return ch
  }

  // Parse a number value.
  const number = () => {
    let number: number
    let string = ''

    if (ch === '-') {
      string = '-'
      next('-')
    }

    while (ch >= '0' && ch <= '9') {
      string += ch
      next()
    }

    if (ch === '.') {
      string += '.'
      while (next() && ch >= '0' && ch <= '9') {
        string += ch
      }
    }

    if (ch === 'e' || ch === 'E') {
      string += ch
      next()

      // Symbol
      if (ch === '-' || ch === '+') {
        string += ch
        next()
      }

      // Single digits
      while (ch >= '0' && ch <= '9') {
        string += ch
        next()
      }
    }

    number = +string

    // Bad number
    if (!isFinite(number)) {
      error('Bad number')
    } else {
      if (Number.isSafeInteger(number)) {
        return !_options.alwaysParseAsBig
          ? number
          : _options.useNativeBigInt
            ? BigInt(number)
            : new BigNumber(number)
      } else {
        // Number with fractional part should be treated as number(double) including big integers in scientific notation, i.e 1.79e+308
        return _options.storeAsString
          ? string
          : /[\.eE]/.test(string)
            ? number
            : _options.useNativeBigInt
              ? BigInt(string)
              : new BigNumber(string)
      }
    }
  }

  // Parse a string value.
  const string = () => {
    let hex: number
    let i: number
    let string = ''
    let uffff: number

    // When parsing for string values, we must look for " and \ characters.
    if (ch === '"') {
      let startAt = at
      while (next()) {
        if (ch === '"') {
          if (at - 1 > startAt) string += text.substring(startAt, at - 1)
          next()
          return string
        }
        if (ch === '\\') {
          if (at - 1 > startAt) string += text.substring(startAt, at - 1)
          next()
          if (ch === 'u') {
            uffff = 0
            for (i = 0; i < 4; i += 1) {
              hex = parseInt(next(), 16)
              if (!isFinite(hex)) {
                break
              }
              uffff = uffff * 16 + hex
            }
            string += String.fromCharCode(uffff)
          } else if (typeof escapee[ch] === 'string') {
            string += escapee[ch]
          } else {
            break
          }
          startAt = at
        }
      }
    }
    error('Bad string')
  }

  // Skip whitespace.
  const white = () => {
    while (ch && ch <= ' ') {
      next()
    }
  }

  // true, false, or null.
  const word = () => {
    switch (ch) {
      case 't':
        next('t')
        next('r')
        next('u')
        next('e')
        return true
      case 'f':
        next('f')
        next('a')
        next('l')
        next('s')
        next('e')
        return false
      case 'n':
        next('n')
        next('u')
        next('l')
        next('l')
        return null
    }
    error("Unexpected '" + ch + "'")
  }

  let value: () => JSONValue // Place holder for the value function.

  // Parse an array value.
  const array = () => {
    const array: JSONArray = []

    // start
    if (ch === '[') {
      next('[')
      white()

      // end
      if (ch === ']') {
        next(']')
        return array // empty array
      }
      while (ch) {
        array.push(value())
        white()
        if (ch === ']') {
          next(']')
          return array
        }
        next(',')
        white()
      }
    }
    error('Bad array')
  }

  // Parse an object value.
  const object = () => {
    let key: string
    const object = Object.create({}) as JSONObject

    if (ch === '{') {
      // start
      next('{')
      white()

      // end
      if (ch === '}') {
        next('}')
        return object // empty object
      }

      while (ch) {
        key = string() as string
        white()
        next(':')
        if (
          _options.strict === true &&
          Object.hasOwnProperty.call(object, key)
        ) {
          error('Duplicate key "' + key + '"')
        }

        if (suspectProtoRx.test(key) === true) {
          if (_options.protoAction === 'error') {
            error('Object contains forbidden prototype property')
          } else if (_options.protoAction === 'ignore') {
            value()
          } else {
            object[key] = value()
          }
        } else if (suspectConstructorRx.test(key) === true) {
          if (_options.constructorAction === 'error') {
            error('Object contains forbidden constructor property')
          } else if (_options.constructorAction === 'ignore') {
            value()
          } else {
            object[key] = value()
          }
        } else {
          object[key] = value()
        }

        white()
        if (ch === '}') {
          next('}')
          return object
        }
        next(',')
        white()
      }
    }
    error('Bad object')
  }

  value = () => {
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    white()
    switch (ch) {
      case '{':
        return object()
      case '[':
        return array()
      case '"':
        return string()
      case '-':
        return number()
      default:
        return ch >= '0' && ch <= '9' ? number() : word()
    }
  }

  // Return the json_parse function. It will have access to all of the above
  // functions and variables.
  return (
    source: string,
    reviver?: (this: any, key: string, value: any) => any,
  ) => {
    let result: JSONValue

    text = source + ''
    at = 0
    ch = ' '
    result = value()
    white()

    if (ch) {
      error('Syntax error')
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.
    if (typeof reviver === 'function') {
      return (function walk(holder: JSONObject, key) {
        let v: number | string
        let value = holder[key]
        if (value && typeof value === 'object') {
          Object.keys(value).forEach((k) => {
            v = walk(value as JSONObject, k)
            if (v !== undefined) {
              value[k] = v
            } else {
              delete value[k]
            }
          })
        }
        return reviver.call(holder, key, value)
      })({ '': result } as JSONObject, '')
    }

    return result
  }
}
