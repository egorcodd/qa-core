/**
 * Точка входа qa-core CLI. Дёргается через `npx qa <cmd>` (см. bin/qa.cjs) или
 * `npm run qa -- <cmd>`. Все команды тонкие — реальная логика в pipeline/stages.
 */

import 'dotenv/config'
import { Command } from 'commander'
import { logger } from './logger'
import { runDoctor } from './doctor'

const program = new Command()
program
  .name('qa')
  .description('qa-core: Jira issue → live pass → TestIT drafts → autotests')
  .version('0.1.0')

program
  .command('doctor')
  .description('Проверить переменные окружения и поля config/project.ts')
  .action(async () => {
    const code = await runDoctor()
    process.exit(code)
  })

program
  .command('run <issueKey>')
  .description('Полный прогон пайплайна по Jira issue (Фаза 1 шаг 2+ — пока заглушка)')
  .action(async (issueKey: string) => {
    logger.info({ issueKey }, 'qa run: пайплайн ещё не подключён (Фаза 1, шаг 1 — каркас)')
    // TODO Phase 1 step 2: вызвать runPipeline(issueKey) из src/pipeline/orchestrator.ts
  })

program
  .command('stage <name> <issueKey>')
  .description('Запустить отдельный стейдж пайплайна (для отладки)')
  .action(async (name: string, issueKey: string) => {
    logger.info({ name, issueKey }, 'qa stage: стейджи ещё не реализованы (Фаза 1, шаг 1)')
    // TODO: runStage(name, issueKey)
  })

program.parseAsync(process.argv).catch((err: unknown) => {
  logger.error({ err }, 'qa: непойманная ошибка')
  process.exit(1)
})
