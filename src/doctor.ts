/**
 * `qa doctor` — проверяет, что критичные переменные окружения и поля
 * config/project.ts заполнены. Без них pipeline уйдёт в no-op.
 *
 * Сейчас (Фаза 1, шаг 1) — только smoke-проверка наличия. По мере появления
 * клиентов будем добавлять реальные ping'и (Jira /myself, TestIT /projects, etc).
 */

import { logger } from './logger'
import { project } from '../config/project'

interface Check {
  name: string
  ok: boolean
  detail?: string
}

function envCheck(name: string): Check {
  const value = process.env[name]
  return { name: `env:${name}`, ok: Boolean(value), detail: value ? 'set' : 'missing' }
}

function configCheck(name: string, value: string): Check {
  return { name: `config:${name}`, ok: Boolean(value), detail: value ? 'set' : 'missing (TODO)' }
}

export async function runDoctor(): Promise<number> {
  const checks: Check[] = [
    envCheck('JIRA_BASE_URL'),
    envCheck('JIRA_EMAIL'),
    envCheck('JIRA_TOKEN'),
    envCheck('TESTIT_BASE_URL'),
    envCheck('TESTIT_TOKEN'),
    envCheck('TESTIT_PROJECT_ID'),
    envCheck('OPENROUTER_API_KEY'),
    envCheck('GITHUB_TOKEN'),
    configCheck('project.jira.projectKey', project.jira.projectKey),
    configCheck('project.testit.projectId', project.testit.projectId),
    configCheck('project.github.repo', project.github.repo),
  ]

  let failed = 0
  for (const c of checks) {
    if (c.ok) {
      logger.info({ check: c.name }, `OK  ${c.detail ?? ''}`.trim())
    } else {
      logger.warn({ check: c.name }, `MISS ${c.detail ?? ''}`.trim())
      failed += 1
    }
  }

  if (failed === 0) {
    logger.info('doctor: всё ок')
    return 0
  }
  logger.warn({ failed }, `doctor: ${failed} проверок не пройдено`)
  return 1
}
