import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './db/mongo.db';

const app = express();
setupApp(app);
runDB(process.env.DB_URL, process.env.DB_NAME);

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}
