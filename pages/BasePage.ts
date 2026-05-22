/**
 * Базовый Page Object. Все POM наследуются отсюда — общая навигация и ожидания.
 * POM'ы продукта живут в pages/, рядом с tests/, по соглашению Playwright-сообщества.
 */

import type { Page } from '@playwright/test'

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected async gotoPath(relativePath: string): Promise<void> {
    await this.page.goto(relativePath)
  }
}
