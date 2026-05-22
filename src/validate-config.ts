/**
 * Жёсткая валидация конфига перед запуском пайплайна. doctor() — мягкая
 * (предупреждает), assertConfigValid() — кидает, если без поля пайплайн нерабочий.
 *
 * Сейчас (шаг 1) — заглушка. Наполнять по мере появления стейджей.
 */

import { project } from '../config/project'

export function assertConfigValid(): void {
  const missing: string[] = []
  if (!project.jira.projectKey) missing.push('config/project.ts → jira.projectKey')
  if (!project.github.repo) missing.push('config/project.ts → github.repo')

  if (missing.length > 0) {
    throw new Error(
      'Config неполный, заполни:\n  - ' + missing.join('\n  - '),
    )
  }
}
