import { BadRequestException } from '../../core/exceptions/bad-request.exception';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { hashPassword } from '../../auth/utils/password.util';
import { TUserInputDto } from '../dto/user.input.dto';
import { TUserOutputDto } from '../dto/user.output.dto';
import { UserQueryInput } from '../dto/user-query.input';
import { usersRepository } from '../repositories/users.repository';
import { mapToUserOutput } from '../routers/mappers/map-user-to-output';

export const usersService = {
  async findMany(query: UserQueryInput): Promise<{
    users: TUserOutputDto[];
    totalCount: number;
  }> {
    const { items, totalCount } = await usersRepository.findMany(query);
    return {
      users: items.map(mapToUserOutput),
      totalCount,
    };
  },
  async create(dto: TUserInputDto): Promise<TUserOutputDto> {
    const [loginOwner, emailOwner] = await Promise.all([
      usersRepository.findByLogin(dto.login),
      usersRepository.findByEmail(dto.email),
    ]);

    // Swagger: ошибка уникальности одна, отдельно от ошибок middleware.
    if (loginOwner) {
      throw new BadRequestException('Login already exists', 'login');
    }

    if (emailOwner) {
      throw new BadRequestException('Email already exists', 'email');
    }

    const createdUser = await usersRepository.create({
      login: dto.login,
      email: dto.email,
      passwordHash: await hashPassword(dto.password),
      createdAt: new Date().toISOString(),
    });

    return mapToUserOutput(createdUser);
  },
  async delete(id: string): Promise<void> {
    const isDeleted = await usersRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException('User not found');
    }
  },
};
