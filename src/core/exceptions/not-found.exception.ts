// Ресурс не найден. Сервис кидает её, errorsHandler превращает в 404.
export class NotFoundException extends Error {
  readonly field: string;

  constructor(message: string, field = 'id') {
    super(message);
    this.field = field;
  }
}
