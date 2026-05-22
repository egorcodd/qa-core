# qa-core — контекст для будущих сессий

Этот файл — точка истины для AI-агентов, работающих с `qa-core`. Полный бриф проекта живёт в `claude-code-prompt.md`. Здесь — что устоялось.

## Что это

Переносимый QA-движок на Playwright + TS. Один npm-пакет, под новый проект клонируется и заполняется `config/`. Триггеры — вебхук Jira + cron в GitHub Actions. Никакого арендованного сервера. Цель — автоматизировать ~90% работы тестировщика, не сжигая бюджет на LLM.

## Жёсткие правила (не нарушать)

1. **LLM не в горячем пути.** Тесты гоняет обычный раннер. LLM зовётся ТОЛЬКО на: генерацию кода, триаж упавших тестов, роутинг.
2. **Ничего не мержится без человека.** Генератор и healer открывают PR с видимым диффом — никакого `git push` в main.
3. **Отчёт — факты из Allure.** Цифры pass/fail/links. LLM только форматирует, не интерпретирует.
4. **Каждый тест сам готовит и убирает свои данные** (особенно для multi-tenant фич типа Companies).
5. **Контроль стоимости.** Один OpenRouter-ключ. Модели в `config/project.ts`: дешёвая на роутинг (Haiku 4.5 / Gemini Flash), сильная на генерацию/триаж (Sonnet 4.6). Логируем токены каждого прогона.
6. **TestIT-кейсы, сгенерированные LLM, создаются в `state: NotReady`** — ревью и перевод в Ready только руками.

## Архитектурные соглашения

### Layout

```
qa-core/
├── .github/workflows/        триггеры
├── config/                   ВСЁ project-specific
├── src/
│   ├── cli.ts                commander
│   ├── doctor.ts             проверка кредов
│   ├── logger.ts             pino
│   ├── validate-config.ts
│   ├── types/                контракты стейджей
│   ├── integrations/         jira / testit / gitlab / openrouter
│   ├── ai/                   router / generate / triage / heal
│   ├── stages/               тонкие шаги пайплайна
│   ├── pipeline/             оркестратор + file-contracts
│   └── prompts/              .md с {{переменными}}
├── pages/                    Page Objects (рядом с tests/, не внутри!)
├── tests/
│   ├── fixtures/
│   └── specs/                @smoke / @regression теги
├── playwright.config.ts
└── package.json
```

**Не нарушать:**
- Page Objects живут в `pages/` на корне репо, НЕ в `tests/page-objects/` (это community-standard Playwright layout).
- Файлы в `src/stages/` НЕ префиксуются номерами (`1-foo.ts`). Именуются по смыслу: `read-context.ts`, `route.ts`, `comment-jira.ts`.
- Если в `src/` появилось слово конкретного продукта (`unowa`, `Kirill`) — это баг, выноси в `config/`.

### LLM-провайдер

Только OpenRouter. Один платный ключ → `OPENROUTER_API_KEY`. Модели задаются в `config/project.ts` (`routerModel`, `generatorModel`), никогда не хардкодятся в `src/`. Клиент будет в `src/integrations/openrouter.ts` — OpenAI-compatible SDK на `https://openrouter.ai/api/v1`. Логирование стоимости — отдельный стейдж, читает `usage` из ответа.

**НЕ использовать `@anthropic-ai/sdk` напрямую.** Если видишь импорт — это ошибка.

### Test IT

REST API `/api/v2`, авторизация заголовком `Authorization: PrivateToken <token>`. Образец рабочих скриптов — `C:\Users\egorcod\Documents\Haiku_Auto\scripts\tms-*.ts`. Существующий клиент с createDraftCase — `C:\Users\egorcod\Documents\qa-auto\src\clients\testit.ts` (порт сюда).

`createDraftCase` обязан создавать кейс со `state: 'NotReady'`. Это hardcoded, не параметр функции.

### Триггеры

Один репо обслуживает два расписания через теги `@smoke` / `@regression` и Playwright projects. Триггеры — workflows в `.github/workflows/`:
- `jira-webhook.yml` — обработка `repository_dispatch` от Jira (issue → Testing + ветка задеплоена).
- `schedule-smoke.yml` — cron на smoke.
- `schedule-regression.yml` — cron на regression.

Ручной trigger (`workflow_dispatch`) — только для отладки.

### Маршрутизация

Детерминированная таблица в `config/triggers.ts`:
- Story + label `new-feature` → `notify-needs-discovery` (НЕ генерим, прошу разведку).
- Story + label `change` → `generate-cases`.
- Bug → `heal-only` (пере-прогон + healer).

LLM зовётся в `src/ai/router.ts` ТОЛЬКО на нечёткое сопоставление области задачи с существующими тестами — только подсветить, не решать.

### Гипотезы, не зашитые намертво

**Playwright Agents.** Бриф упоминает `npx playwright init-agents`. Сейчас это гипотеза — сначала прогоняем planner на фиче Companies, потом решаем: Agents или свой вызов через OpenRouter. В `src/ai/generate.ts` оставлять TODO до принятия решения.

## Языки

Код, доки, комментарии, промпты — русский.

## Стиль автотестов

См. `qa-auto/CLAUDE.md` раздел "Стиль автотестов" — POM-only в spec'ах, изоляция, фикстуры через `test.extend`, селекторы по приоритету `getByRole > getByLabel > getByPlaceholder > getByText > getByTestId`, никаких `waitForTimeout`. Перенесём сюда явно по мере появления первых spec'ов.

## Roadmap

- Фаза 1 (текущая): ядро на Unowa. Идём строго по шагам брифа.
- Фаза 2: переносимость, репо как GitHub Template.
- Фаза 3: дашборд (только если будет 3+ проекта).
