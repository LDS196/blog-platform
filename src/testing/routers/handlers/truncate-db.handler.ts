import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import {
  blogsCollection,
  postsCollection,
  usersCollection,
} from '../../../db/collections';

// Полностью очищает данные (используется в e2e-тестах перед прогоном).
export async function truncateDbHandler(req: Request, res: Response) {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  res.sendStatus(HttpStatus.NoContent);
}
