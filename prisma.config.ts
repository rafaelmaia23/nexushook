import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: '.env.development' });

const POSTGRES_URL =
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}` +
  `@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: POSTGRES_URL,
  },
});
