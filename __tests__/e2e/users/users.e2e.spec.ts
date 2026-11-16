import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { USERS_PATH } from '../../../src/users/constants/users.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createUser } from '../../utils/users/create-user';
import { getUserDto } from '../../utils/users/get-user-dto';

describe('Users API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeEach(async () => {
    await clearDb(app);
  });

  it('✅ should create user without password in response; POST /api/users', async () => {
    const dto = getUserDto();

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(dto)
      .expect(HttpStatus.Created);

    expect(response.body).toEqual({
      id: expect.any(String),
      login: dto.login,
      email: dto.email,
      createdAt: expect.any(String),
    });
    expect(response.body.password).toBeUndefined();
    expect(response.body.passwordHash).toBeUndefined();
  });

  it('❌ should return 401 without auth; POST /api/users', async () => {
    await request(app)
      .post(USERS_PATH)
      .send(getUserDto())
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return one error when login already exists; POST /api/users', async () => {
    const dto = getUserDto();
    await createUser(app, dto);

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...getUserDto(),
        login: dto.login,
      })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual([
      {
        field: 'login',
        message: expect.any(String),
      },
    ]);
  });

  it('✅ should return users with search by login or email; GET /api/users', async () => {
    const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 4);
    const loginTerm = `aa${suffix}`;
    const emailTerm = `zz${suffix}`;

    await createUser(app, {
      login: loginTerm,
      email: `one${suffix}@example.dev`,
    });
    await createUser(app, {
      login: `bb${suffix}`,
      email: `${emailTerm}@example.dev`,
    });

    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .query({
        searchLoginTerm: loginTerm,
        searchEmailTerm: emailTerm,
      })
      .expect(HttpStatus.Ok);

    expect(response.body.totalCount).toBe(2);
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ login: loginTerm }),
        expect.objectContaining({ email: `${emailTerm}@example.dev` }),
      ]),
    );
    expect(response.body.items[0].passwordHash).toBeUndefined();
  });

  it('❌ should return 401 without auth; GET /api/users', async () => {
    await request(app).get(USERS_PATH).expect(HttpStatus.Unauthorized);
  });

  it('✅ should delete user; DELETE /api/users/:id', async () => {
    const createdUser = await createUser(app);

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
