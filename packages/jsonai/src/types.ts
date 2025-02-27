import { type BigNumber } from 'bignumber.js'

export interface JSONObject extends Record<string, JSONValue> {}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | BigNumber
  | bigint
  | undefined
  | JSONObject
  | JSONArray

export type JSONArray = JSONValue[]
