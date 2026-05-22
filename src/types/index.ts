/**
 * Контракты между стейджами пайплайна. Каждый стейдж читает и пишет JSON
 * под results/<KEY>/, эти типы — точка истины для shape файлов.
 *
 * TODO: расширять по мере появления стейджей. Сейчас минимум для каркаса.
 */

export type IssueType = 'story' | 'bug' | 'task' | 'unknown'

export type RouterAction =
  | 'generate-cases'
  | 'heal-only'
  | 'notify-needs-discovery'
  | 'skip'

export interface Issue {
  key: string
  summary: string
  description: string
  acceptanceCriteria: string[]
  type: IssueType
  labels: string[]
  status: string
}

export interface Context {
  issue: Issue
}

export interface RouterDecision {
  action: RouterAction
  reasoning: string
}

export type StageName =
  | 'read-context'
  | 'route'
  | 'detect-feature'
  | 'generate-cases'
  | 'generate-autotests'
  | 'heal'
  | 'triage'
  | 'comment-jira'
