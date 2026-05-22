/**
 * Тестовые роли продукта. storageState файлы лежат в .auth/<env>/<role>.json,
 * создаются командой `qa auth <role>` (см. Фазу 1 шаг 10).
 *
 * TODO для Unowa: расширить тип Role под реальные роли и заполнить authFile-пути.
 */

import path from 'node:path'
import { currentEnv } from './env'

export type Role = 'owner' | 'methodist' | 'user'

interface RoleConfig {
  email: string
  description: string
  authFile: string
}

function authFile(role: Role): string {
  return path.join(process.cwd(), '.auth', currentEnv(), `${role}.json`)
}

export const roles: Record<Role, RoleConfig> = {
  owner: { email: '', description: '', authFile: authFile('owner') },
  methodist: { email: '', description: '', authFile: authFile('methodist') },
  user: { email: '', description: '', authFile: authFile('user') },
}
