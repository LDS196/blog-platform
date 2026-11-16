import { TUserInputDto } from '../../../src/users/dto/user.input.dto';

export function getUserDto(): TUserInputDto {
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6);

  return {
    login: `u${suffix}`,
    password: 'password1',
    email: `${suffix}@example.dev`,
  };
}
