import request from 'supertest';
import { app } from '@/app/app';

describe('POST /api/users', () => {
  describe('with anonymous user', () => {
    describe('with invalid input', () => {
      it('returns 400 if email is missing', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ password: '123456' });

        expect(response.status).toBe(400);
      });
    });
  });
});
