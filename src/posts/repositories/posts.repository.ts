import { WithId } from 'mongodb';
import { toObjectId } from '../../core/utils/to-objectId';
import { postsCollection } from '../../db/collections';
import { TPost } from '../types/post';
import { TPostInputDto } from '../dto/post.input.dto';
import { PostQueryInput } from '../dto/post-query.input';

export const postsRepository = {
  findMany: async (
    queryInput: PostQueryInput,
  ): Promise<{ posts: WithId<TPost>[]; totalCount: number }> => {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;

    const skip = (pageNumber - 1) * pageSize;
    const sort = { [sortBy]: sortDirection };
    const posts = await postsCollection
      .find()
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();
    return { posts, totalCount };
  },
  findById: async (id: string): Promise<WithId<TPost> | null> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return null;
    }
    return postsCollection.findOne({ _id: objectId });
  },
  findByBlogId: async (
    blogId: string,
    queryInput: PostQueryInput,
  ): Promise<{ posts: WithId<TPost>[]; totalCount: number }> => {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const filter = { blogId };
    const skip = (pageNumber - 1) * pageSize;
    const sort = { [sortBy]: sortDirection };
    const posts = await postsCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments(filter);
    return { posts, totalCount };
  },
  create: async (post: TPost): Promise<WithId<TPost> | null> => {
    const result = await postsCollection.insertOne(post);
    return {
      _id: result.insertedId,
      ...post,
    };
  },
  update: async (id: string, post: TPostInputDto): Promise<boolean> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }
    const result = await postsCollection.updateOne(
      { _id: objectId },
      { $set: post },
    );
    return result.matchedCount > 0;
  },
  delete: async (id: string): Promise<boolean> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }
    const result = await postsCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
  deleteByBlogId: async (blogId: string): Promise<void> => {
    await postsCollection.deleteMany({ blogId });
  },
};
