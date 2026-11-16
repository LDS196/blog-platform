import { WithId } from 'mongodb';
import { toObjectId } from '../../core/utils/to-objectId';
import { usersCollection } from '../../db/collections';
import { TUser } from '../types/user';
import { UserQueryInput } from '../dto/user-query.input';
import { UserSortField } from '../dto/user-sort-field';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsTerm(value: string) {
  return {
    $regex: escapeRegex(value),
    $options: 'i' as const,
  };
}

export const usersRepository = {
  findMany: async (
    query: UserQueryInput,
  ): Promise<{
    items: WithId<TUser>[];
    totalCount: number;
  }> => {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = query;
    const orFilters = [];

    if (typeof searchLoginTerm === 'string' && searchLoginTerm !== '') {
      orFilters.push({ login: containsTerm(searchLoginTerm) });
    }

    if (typeof searchEmailTerm === 'string' && searchEmailTerm !== '') {
      orFilters.push({ email: containsTerm(searchEmailTerm) });
    }

    const filter = orFilters.length > 0 ? { $or: orFilters } : {};
    const skip = (pageNumber - 1) * pageSize;
    const sortField = sortBy;
    const sort = { [sortField]: sortDirection };

    const users = await usersCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await usersCollection.countDocuments(filter);
    return { items: users, totalCount };
  },
  findByLogin: async (login: string): Promise<WithId<TUser> | null> => {
    return usersCollection.findOne({ login });
  },
  findByEmail: async (email: string): Promise<WithId<TUser> | null> => {
    return usersCollection.findOne({ email });
  },
  findByLoginOrEmail: async (
    loginOrEmail: string,
  ): Promise<WithId<TUser> | null> => {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  create: async (user: TUser): Promise<WithId<TUser>> => {
    const result = await usersCollection.insertOne(user);
    return {
      _id: result.insertedId,
      ...user,
    };
  },
  delete: async (id: string): Promise<boolean> => {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }
    const result = await usersCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
};
