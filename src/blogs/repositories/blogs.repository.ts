import { WithId } from 'mongodb';
import { toObjectId } from '../../core/utils/to-objectId';
import { blogsCollection } from '../../db/collections';
import { TBlog } from '../types/blog';
import { TBlogInputDto } from '../dto/blog.input.dto';

export const blogsRepository = {
  findAll: async (): Promise<WithId<TBlog>[]> => {
    return blogsCollection.find({}).toArray();
  },
  findById: async (id: string): Promise<WithId<TBlog> | null> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return null;
    }
    return blogsCollection.findOne({ _id: objectId });
  },
  create: async (blog: TBlog): Promise<WithId<TBlog>> => {
    const result = await blogsCollection.insertOne(blog);
    return {
      _id: result.insertedId,
      ...blog,
    };
  },
  update: async (id: string, blog: TBlogInputDto): Promise<boolean> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }
    const result = await blogsCollection.updateOne(
      { _id: objectId },
      { $set: blog },
    );
    return result.modifiedCount > 0;
  },
  delete: async (id: string): Promise<boolean> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }
    const result = await blogsCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
};
