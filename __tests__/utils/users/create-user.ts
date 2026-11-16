import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TUserInputDto } from '../../../src/users/dto/user.input.dto';
import { TUserOutputDto } from '../../../src/users/dto/user.output.dto';
import { USERS_PATH } from '../../../src/users/constants/users.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getUserDto } from './get-user-dto';

export async function createUser(
  app: Express,
  userDto?: Partial<TUserInputDto>,
): Promise<TUserOutputDto> {
  const testUserData: TUserInputDto = { ...getUserDto(), ...userDto };

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return createdUserResponse.body;
}
