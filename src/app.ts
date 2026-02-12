import express from 'express';
import cors from 'cors';
import { httpLogger } from './core/logger/http.logger';
import { errorHandler } from '@/core/middlewares/error.middleware';

export const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);

app.use(express.json());

app.use(httpLogger);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
