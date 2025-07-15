import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    ssl: false,
  },
});
