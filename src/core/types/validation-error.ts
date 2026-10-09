// Одна ошибка валидации: какое поле не прошло и почему.
export type TValidationErrorType = {
  field: string;
  message: string;
};

// Единый формат тела ответа при ошибке валидации.
export type TValidationErrorDto = { errorsMessages: TValidationErrorType[] };
