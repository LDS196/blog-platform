import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../db/collections';
import { TPost } from '../types/post';
import { TPostInputDto } from '../dto/post.input.dto';

export const postsRepository = {
  findAll: async (): Promise<WithId<TPost>[]> => {
    return await postsCollection.find().toArray();
  },
  findById: async (id: string): Promise<WithId<TPost> | null> => {
    return await postsCollection.findOne({ _id: new ObjectId(id) });
  },
  findByBlogId: async (blogId: string): Promise<WithId<TPost>[]> => {
    return await postsCollection.find({ blogId }).toArray();
  },
  create: async (post: TPost): Promise<WithId<TPost> | null> => {
    const result = await postsCollection.insertOne(post);
    return {
      _id: result.insertedId,
      ...post,
    };
  },
  update: async (id: string, post: TPostInputDto): Promise<boolean> => {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post },
    );
    return result.modifiedCount > 0;
  },
  delete: async (id: string): Promise<boolean> => {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
  deleteByBlogId: async (blogId: string): Promise<void> => {
    await postsCollection.deleteMany({ blogId });
  },
};
