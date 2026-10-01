import { PostOutputDto } from '../../dto/post.output.dto';
import { TPost } from '../../types/post';

export const mapToPostsListOutput = (posts: TPost[]): PostOutputDto[] => {
  return posts.map((p) => p);
};
