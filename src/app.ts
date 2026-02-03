import express from 'express';
import cors from 'cors';

export const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
