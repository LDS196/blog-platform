import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToBlogsListOutput } from '../mappers/map-list-blogs-to-output';

export async function getBlogsListHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsRepository.findAll();
    res.status(HttpStatus.Ok).send(mapToBlogsListOutput(blogs));
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
