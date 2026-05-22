/**
 * Известные роуты продукта. Подсказка для detect-feature и router'а — какие пути
 * относятся к каким фичам/областям.
 *
 * TODO: пользователь заполнит роуты Unowa сам. Структура — список объектов
 * { path, feature, area, role? } по образцу qa-auto/config/routes.ts.
 */

export interface RouteHint {
  path: string
  feature: string
  area: string
  role?: string
}

export const routes: RouteHint[] = [
  // TODO: добавить роуты Unowa
]
