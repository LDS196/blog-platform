import { db } from '../../db/in-memory.db';
import { TPost } from '../types/post';
import { PostInputDto } from '../dto/post.input.dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postsRepository = {
  findAll: (): TPost[] => {
    return db.posts;
  },
  findById: (id: string): TPost | null => {
    return db.posts.find((p) => p.id === id) ?? null;
  },
  findByBlogId: (blogId: string): TPost[] => {
    return db.posts.filter((p) => p.blogId === blogId);
  },
  create: (post: PostInputDto): TPost | null => {
    const blog = blogsRepository.findById(post.blogId);
    if (!blog) {
      return null;
    }

    const newPost: TPost = {
      ...post,
      id: crypto.randomUUID(),
      blogName: blog.name,
    };
    db.posts.push(newPost);
    return newPost;
  },
  update: (id: string, post: PostInputDto): boolean => {
    const postIndex = db.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return false;
    }

    const blog = blogsRepository.findById(post.blogId);
    if (!blog) {
      return false;
    }

    db.posts[postIndex] = {
      ...db.posts[postIndex],
      ...post,
      blogName: blog.name,
      id,
    };
    return true;
  },
  delete: (id: string): boolean => {
    const postIndex = db.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return false;
    }
    db.posts.splice(postIndex, 1);
    return true;
  },
  deleteByBlogId: (blogId: string): void => {
    db.posts = db.posts.filter((p) => p.blogId !== blogId);
  },
};
