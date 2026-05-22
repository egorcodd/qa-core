/**
 * REST-helper для setup/teardown тестовых данных. Каждый тест сам готовит
 * и убирает свои данные — особенно важно для multi-tenant фич типа "Companies"
 * (бриф, пункт 5 жёстких принципов).
 *
 * TODO Phase 1 step 10: реализовать создание/удаление сущностей через API продукта.
 */

export class ApiHelper {
  constructor(private readonly baseUrl: string) {}

  // TODO: createCompany / deleteCompany / createUser / ...
}
