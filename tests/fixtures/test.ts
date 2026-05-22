/**
 * Базовая фикстура для всех spec'ов. Расширять под нужды: storageState per role,
 * API-helper для seed/teardown, фабрики данных.
 *
 * TODO Phase 1 step 10: подключить ApiHelper для setup/teardown тестовых данных.
 */

import { test as base } from '@playwright/test'

export const test = base.extend({})
export { expect } from '@playwright/test'
