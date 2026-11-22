import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './db/mongo.db';

const app = express();
setupApp(app);
runDB(process.env.DB_URL, process.env.DB_NAME);

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT;
  const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  // Checker рвёт запрос на 6 с и переиспользует сокет. Дефолт Node 5 с
  // закрывает его раньше. 61 с копило соединения на бесплатном ngrok.
  server.keepAliveTimeout = 15_000;
  server.headersTimeout = 20_000;
}
