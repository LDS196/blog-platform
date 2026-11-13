import { WithId } from 'mongodb';
import { toObjectId } from '../../core/utils/to-objectId';
import { blogsCollection } from '../../db/collections';
import { TBlog } from '../types/blog';
import { TBlogInputDto } from '../dto/blog.input.dto';
import { BlogQueryInput } from '../dto/blog-query.input';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const blogsRepository = {
  findMany: async (
    query: BlogQueryInput,
  ): Promise<{
    items: WithId<TBlog>[];
    totalCount: number;
  }> => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchBlogNameTerm } =
      query;
    const filter =
      typeof searchBlogNameTerm === 'string' && searchBlogNameTerm !== ''
        ? {
            name: {
              $regex: escapeRegex(searchBlogNameTerm),
              $options: 'i' as const,
            },
          }
        : {};
    const skip = (pageNumber - 1) * pageSize;
    const sort = { [sortBy]: sortDirection };

    const blogs = await blogsCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await blogsCollection.countDocuments(filter);
    return { items: blogs, totalCount };
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
    return result.matchedCount > 0;
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
