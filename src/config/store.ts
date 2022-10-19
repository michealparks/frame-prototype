import type { Config } from './types'

let config: Config | undefined

export const setConfig = (value: Config) => {
  config = value
}

export const getConfig = (): Config | undefined => {
  return config
}
