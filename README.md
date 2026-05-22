# qa-core

Переносимый шаблон автоматизации QA на Playwright + TypeScript. Один npm-пакет, который автоматизирует ~90% работы тестировщика и переносится на другие проекты сменой `config/`. Первый целевой продукт — Unowa.

## Что делает

Триггер — webhook из Jira (issue в статус Testing + ветка задеплоена) или cron в CI:
1. Читает Jira issue + связанные MR.
2. (если новая фича) уведомляет о необходимости разведки; (если доработка) генерит тест-кейсы в TestIT в state `NotReady`.
3. Гонит существующие/сгенерированные автотесты через Playwright.
4. Падения → триаж (баг продукта / устаревший тест / флак) и healer для починки локаторов — всё в PR, не в main.
5. Отчёт в Jira: цифры из Allure, LLM только форматирует.

## Жёсткие принципы

- LLM не в горячем пути: на каждый прогон LLM НЕ зовётся. Только на генерацию, триаж и роутинг.
- Ничего не мержится без человека: генератор и healer открывают PR с видимым диффом локатора.
- Один платный OpenRouter-ключ, модели выбираются в `config/project.ts` (дешёвая на роутинг, сильная на генерацию).
- Кейсы, сгенерированные LLM, ВСЕГДА создаются как `state: NotReady` — ревью и перевод в Ready только руками.
- Никакого арендованного сервера: триггеры через GitHub Actions.

## Быстрый старт

```bash
cp .env.example .env
# заполнить JIRA_*, TESTIT_*, OPENROUTER_API_KEY, GITHUB_TOKEN

npm install
npx playwright install chromium

# проверить, что креды и поля config/ заполнены
npx qa doctor

# (после реализации стейджей) полный прогон
npx qa run UNW-123

# отдельный стейдж — для отладки
npx qa stage <stage-name> UNW-123
```

## Структура

```
qa-core/
├── .github/workflows/        — триггеры (вебхук Jira + cron) — добавятся в шаге 2
├── config/                   — ВСЁ project-specific только здесь
│   ├── project.ts            — name, Jira/TestIT/GitHub IDs, модели OpenRouter
│   ├── env.ts                — baseUrl стендов
│   ├── roles.ts              — тестовые аккаунты
│   ├── routes.ts             — известные роуты (заполняется руками)
│   └── triggers.ts           — Jira labels → action (детерминированно)
├── src/
│   ├── cli.ts                — точка входа, commander
│   ├── doctor.ts             — `qa doctor`
│   ├── logger.ts             — pino
│   ├── validate-config.ts
│   ├── types/                — контракты между стейджами
│   ├── integrations/         — jira / testit / gitlab / openrouter
│   ├── ai/                   — router / generate / triage / heal (всё, что зовёт LLM)
│   ├── stages/               — тонкие шаги пайплайна (без префиксов с номерами)
│   ├── pipeline/             — оркестратор
│   └── prompts/              — шаблоны промптов (.md с {{переменными}})
├── pages/                    — Page Objects (рядом с tests/, как в Playwright community)
├── tests/
│   ├── fixtures/             — test.extend + ApiHelper
│   └── specs/                — e2e-тесты, теги @smoke / @regression
├── playwright.config.ts      — два project'а по тегам, Allure reporter
├── package.json
└── CLAUDE.md                 — полный контекст архитектуры для будущих сессий
```

## Перенос на новый проект

1. Клонировать репо как новый.
2. Заполнить `config/project.ts`, `config/env.ts`, `config/roles.ts`, `config/routes.ts`.
3. Положить `.env` с токенами.
4. `npx qa auth <role>` под каждую роль (один раз).
5. `npx qa run <ISSUE_KEY>` на тестовой задаче.

`src/` трогать не нужно. Если потребовалось — это сигнал, что движок недостаточно общий, фикс делается здесь и подтягивается обратно.

## Статус

Фаза 1, шаг 1: каркас. Триггеры и стейджи — следующие шаги, см. `claude-code-prompt.md`.
