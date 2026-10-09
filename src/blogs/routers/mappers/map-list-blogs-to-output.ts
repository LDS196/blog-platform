import { WithId } from 'mongodb';
import { TBlogOutputDto } from '../../dto/blog.output.dto';
import { TBlog } from '../../types/blog';

export const mapToBlogOutput = (blog: WithId<TBlog>): TBlogOutputDto => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});

export const mapToBlogsListOutput = (
  blogs: WithId<TBlog>[],
): TBlogOutputDto[] => {
  return blogs.map(mapToBlogOutput);
};
