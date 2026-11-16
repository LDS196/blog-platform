import { UnauthorizedException } from '../../core/exceptions/unauthorized.exception';
import { usersRepository } from '../../users/repositories/users.repository';
import { TLoginInputDto } from '../dto/login.input.dto';
import { dummyPasswordHash, isPasswordValid } from '../utils/password.util';

export const authService = {
  async login(input: TLoginInputDto): Promise<void> {
    const user = await usersRepository.findByLoginOrEmail(input.loginOrEmail);
    const passwordHash = user?.passwordHash ?? dummyPasswordHash();
    const isValid = await isPasswordValid(input.password, passwordHash);

    if (!user || !isValid) {
      throw new UnauthorizedException();
    }
  },
};
