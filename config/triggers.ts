/**
 * Маппинг Jira issuetype + labels → действие роутера. Чисто детерминированная
 * таблица, никакого LLM. Используется в src/ai/router.ts (несмотря на расположение
 * — сам роутер LLM зовёт ТОЛЬКО для нечёткой подсветки, основное решение здесь).
 *
 * Договорённость о разметке Jira:
 *   Story + label "new-feature" = новая-новая фича  → notify (нужна разведка вручную)
 *   Story + label "change"      = доработка          → generate-cases
 *   Bug                          = баг               → heal-only (пере-прогон + heal)
 */

import type { IssueType, RouterAction } from '../src/types'

export interface TriggerRule {
  type: IssueType
  requireLabels?: string[] // ВСЕ перечисленные должны быть на задаче
  forbidLabels?: string[]
  action: RouterAction
  reasoning: string
}

export const triggers: TriggerRule[] = [
  {
    type: 'story',
    requireLabels: ['new-feature'],
    action: 'notify-needs-discovery',
    reasoning: 'Story + new-feature: нужна разведка, тесткейсы не генерим',
  },
  {
    type: 'story',
    requireLabels: ['change'],
    action: 'generate-cases',
    reasoning: 'Story + change: доработка существующей фичи, идём в генерацию',
  },
  {
    type: 'bug',
    action: 'heal-only',
    reasoning: 'Bug: не генерим, пере-прогон существующих тестов + healer',
  },
]

export const defaultAction: RouterAction = 'skip'
