/**
 * Project-specific конфиг. Для нового форка трогаем именно этот файл (плюс соседние в config/).
 * Ничего из src/ менять не нужно.
 *
 * TODO для Unowa: заполнить jira.projectKey, testit.projectId, github.repo.
 */

export const project = {
  name: 'unowa',

  jira: {
    projectKey: '', // TODO: например 'UNW'
  },

  testit: {
    projectId: '', // TODO: UUID проекта в TestIT
    jiraKeyField: 'jiraKey', // имя custom-поля для обратной ссылки на Jira issue
  },

  github: {
    repo: '', // TODO: формат "owner/repo" для repository_dispatch и PR'ов
  },

  openrouter: {
    // Модель на роутинг/классификацию. Дешёвая по дефолту, для нечётких сопоставлений.
    // Кандидаты: anthropic/claude-haiku-4.5, google/gemini-flash, openai/gpt-4o-mini.
    routerModel: 'anthropic/claude-haiku-4.5',

    // Модель на генерацию кейсов/тестов и триаж. Сильная.
    // Кандидаты: anthropic/claude-sonnet-4.6, openai/gpt-4o.
    generatorModel: 'anthropic/claude-sonnet-4.6',
  },
} as const

export type ProjectConfig = typeof project
