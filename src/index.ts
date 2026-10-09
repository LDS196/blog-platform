import 'dotenv/config';
import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './db/mongo.db';

const bootstrap = async () => {
  const app = express();
  setupApp(app);
  await runDB(process.env.DB_URL, process.env.DB_NAME);

  if (!process.env.VERCEL) {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  }
};

bootstrap();
