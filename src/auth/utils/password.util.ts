import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Валидный hash, чтобы compare отработал и когда пользователя нет.
const DUMMY_PASSWORD_HASH =
  '$2b$10$fTnzX8iy6C17vszSEIW5TuyiHR/Ab0ZFATX5b1HM58RUKE/GvYPEG';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function isPasswordValid(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function dummyPasswordHash(): string {
  return DUMMY_PASSWORD_HASH;
}
