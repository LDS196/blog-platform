// Неверные учётные данные. errorsHandler отдаёт 401 без тела.
export class UnauthorizedException extends Error {
  constructor() {
    super('Unauthorized');
  }
}
