import { WithId } from 'mongodb';
import { TPostOutputDto } from '../../dto/post.output.dto';
import { TPost } from '../../types/post';

export const mapToPostsListOutput = (
  posts: WithId<TPost>[],
): TPostOutputDto[] => {
  return posts.map((p) => mapToPostOutput(p));
};

export function mapToPostOutput(post: WithId<TPost>): TPostOutputDto {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
