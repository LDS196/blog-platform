// Ошибка бизнес-правила, которую клиент может исправить. errorsHandler отдаёт 400.
export class BadRequestException extends Error {
  readonly field: string;

  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
}
