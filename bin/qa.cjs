#!/usr/bin/env node
/**
 * npm bin shim для команды `qa`. Регистрирует tsx как loader и подгружает src/cli.ts.
 * Скрипты `npm run qa` / `npm run doctor` дёргают tsx напрямую и эту обёртку не используют.
 */

require('tsx/cjs')
require('../src/cli.ts')
