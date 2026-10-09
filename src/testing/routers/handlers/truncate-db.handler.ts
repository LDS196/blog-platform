import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsCollection, postsCollection } from '../../../db/collections';

// Полностью очищает данные (используется в e2e-тестах перед прогоном).
export async function truncateDbHandler(req: Request, res: Response) {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  res.sendStatus(HttpStatus.NoContent);
}
