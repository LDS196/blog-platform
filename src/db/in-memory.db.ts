import { TBlog } from '../blogs/types/blog';
import { TPost } from '../posts/types/post';

export const db: { blogs: TBlog[]; posts: TPost[] } = {
  blogs: [],
  posts: [],
};
