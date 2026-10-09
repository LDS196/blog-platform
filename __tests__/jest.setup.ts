import dotenv from 'dotenv';
import { runDB, stopDB } from '../src/db/mongo.db';

dotenv.config({ quiet: true });

beforeAll(async () => {
  const dbUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME_TEST;

  if (!dbUrl) {
    throw new Error('DB_URL is not set');
  }

  if (!dbName) {
    throw new Error('DB_NAME_TEST is not set');
  }

  await runDB(dbUrl, dbName);
});

afterAll(async () => {
  await stopDB();
});
