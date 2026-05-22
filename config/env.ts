/**
 * Адреса стендов. QA_ENV из .env выбирает текущий.
 */

export type EnvName = 'dev' | 'stage' | 'prod'

interface EnvConfig {
  baseUrl: string
}

export const environments: Record<EnvName, EnvConfig> = {
  dev: { baseUrl: '' }, // TODO
  stage: { baseUrl: '' }, // TODO
  prod: { baseUrl: '' }, // TODO
}

export function currentEnv(): EnvName {
  const raw = (process.env.QA_ENV ?? 'dev') as EnvName
  if (!(raw in environments)) {
    throw new Error(`QA_ENV=${raw} не описан в config/env.ts`)
  }
  return raw
}

export function currentConfig(): EnvConfig {
  return environments[currentEnv()]
}
