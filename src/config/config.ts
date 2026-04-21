import { env } from './env';

export const config = {
  app: {
    env: env.APP_ENV,
    port: env.PORT,
    isProduction: env.APP_ENV === 'production',
  },

  database: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    name: env.POSTGRES_DB,

    url: `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,

    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
  },

  logger: {
    level: env.LOGGER_LEVEL,
  },

  password: {
    saltRounds: env.BCRYPT_SALT_ROUNDS,
    pepper: env.BCRYPT_PEPPER,
  },
};
