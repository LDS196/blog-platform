import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { AUTH_PATH } from '../../../src/auth/constants/auth.paths';
import { clearDb } from '../../utils/clear-db';
import { createUser } from '../../utils/users/create-user';
import { getUserDto } from '../../utils/users/get-user-dto';

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  const loginPath = `${AUTH_PATH}/login`;

  beforeEach(async () => {
    await clearDb(app);
  });

  it('✅ should login by login and by email; POST /api/auth/login', async () => {
    const dto = getUserDto();
    await createUser(app, dto);

    await request(app)
      .post(loginPath)
      .send({ loginOrEmail: dto.login, password: dto.password })
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(loginPath)
      .send({ loginOrEmail: dto.email, password: dto.password })
      .expect(HttpStatus.NoContent);
  });

  it('❌ should return 401 for wrong password and unknown login; POST /api/auth/login', async () => {
    const dto = getUserDto();
    await createUser(app, dto);

    await request(app)
      .post(loginPath)
      .send({ loginOrEmail: dto.login, password: 'wrong-password' })
      .expect(HttpStatus.Unauthorized);

    await request(app)
      .post(loginPath)
      .send({ loginOrEmail: 'missing-user', password: dto.password })
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return 400 when login body is invalid; POST /api/auth/login', async () => {
    await request(app)
      .post(loginPath)
      .send({ loginOrEmail: 1, password: 'password1' })
      .expect(HttpStatus.BadRequest);
  });
});
