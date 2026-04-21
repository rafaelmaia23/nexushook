import express from 'express';
import cors from 'cors';
import { httpLogger } from '@/shared/logger/http.logger';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import router from '@/app/routes';

export const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);

app.use(express.json());

app.use(httpLogger);

app.use('/api', router);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
