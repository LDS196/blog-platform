import { Db, MongoClient } from 'mongodb';
import { initCollections } from './collections';

export let client: MongoClient;
let isConnected = false;

// Подключение к БД
export async function runDB(
  url: string | undefined,
  dbName: string | undefined,
): Promise<void> {
  if (isConnected) {
    return;
  }

  if (!url) {
    throw new Error('DB_URL is not set');
  }

  if (!dbName) {
    throw new Error('DB_NAME is not set');
  }

  client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000,
  });
  const db: Db = client.db(dbName);

  // Инициализируем коллекции из подключённой базы.
  initCollections(db);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    isConnected = true;
    console.log(`✅ Connected to the database: ${dbName}`);
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  await client.close();
  isConnected = false;
}
