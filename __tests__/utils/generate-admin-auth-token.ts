// Собирает заголовок Basic Auth с логином/паролем супер-админа для тестов.
export function generateBasicAuthToken() {
  const credentials = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}
