import { db } from '../../db/in-memory.db';
import { TBlog } from '../types/blog';
import { BlogInputDto } from '../dto/blog.input.dto';

export const blogsRepository = {
  findAll: (): TBlog[] => {
    return db.blogs;
  },
  findById: (id: string): TBlog | null => {
    return db.blogs.find((b) => b.id === id) ?? null;
  },
  create: (blog: BlogInputDto): TBlog => {
    const newBlog: TBlog = {
      ...blog,
      id: crypto.randomUUID(),
    };
    db.blogs.push(newBlog);
    return newBlog;
  },
  update: (id: string, blog: BlogInputDto): boolean => {
    const blogIndex = db.blogs.findIndex((b) => b.id === id);
    if (blogIndex === -1) {
      return false;
    }
    db.blogs[blogIndex] = {
      ...db.blogs[blogIndex],
      ...blog,
      id: id,
    };
    return true;
  },
  delete: (id: string): boolean => {
    const blogIndex = db.blogs.findIndex((b) => b.id === id);
    if (blogIndex === -1) {
      return false;
    }
    db.blogs = db.blogs.splice(blogIndex, 1);
    return true;
  },
};
