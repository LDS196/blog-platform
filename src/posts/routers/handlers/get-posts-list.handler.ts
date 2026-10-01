import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToPostsListOutput } from '../mappers/map-list-posts-to-output';

export function getPostsListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  res.status(HttpStatus.Ok).send(mapToPostsListOutput(posts));
}
