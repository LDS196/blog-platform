import { Collection, Db } from 'mongodb';
import { TBlog } from '../blogs/types/blog';
import { TPost } from '../posts/types/post';
import { TUser } from '../users/types/user';

export const BLOGS_COLLECTION_NAME = 'blogs';
export const POSTS_COLLECTION_NAME = 'posts';
export const USERS_COLLECTION_NAME = 'users';

export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;
export let usersCollection: Collection<TUser>;

export function initCollections(db: Db): void {
  blogsCollection = db.collection<TBlog>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<TPost>(POSTS_COLLECTION_NAME);
  usersCollection = db.collection<TUser>(USERS_COLLECTION_NAME);
}
