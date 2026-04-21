jest.mock('@/config/config', () => ({
  config: {
    app: { env: 'production' },
    password: {
      saltRounds: 14,
      pepper: 'pepper-secret',
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import bcrypt from 'bcryptjs';
import { PasswordService } from './password.service';
import type { CreateUserInput } from '../user';

describe('PasswordService.hashPassword', () => {
  const service = new PasswordService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call bcrypt with password + pepper and correct salt rounds', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-value');

    const input = {
      email: 'test@mail.com',
      password: '123456',
    };

    const result = await service.hashPassword(input);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456pepper-secret', 14);

    expect(result).toEqual({
      email: 'test@mail.com',
      password: 'hashed-value',
    });
  });

  it('should preserve other user fields', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash');

    const input = {
      email: 'admin@mail.com',
      password: '123',
      role: 'ADMIN',
    } satisfies CreateUserInput;

    const result = await service.hashPassword(input);

    expect(result).toMatchObject({
      email: 'admin@mail.com',
      role: 'ADMIN',
      password: 'hash',
    });
  });

  it('should propagate bcrypt errors', async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('bcrypt failure'));

    await expect(
      service.hashPassword({
        email: 'a@a.com',
        password: '123',
      }),
    ).rejects.toThrow('bcrypt failure');
  });

  it('uses 1 salt round when not in production', async () => {
    jest.resetModules();

    jest.mock('@/config/config', () => ({
      config: {
        app: { env: 'development' },
        password: { saltRounds: 12, pepper: 'pep' },
      },
    }));

    jest.mock('bcryptjs', () => ({
      hash: jest.fn().mockResolvedValue('hash'),
    }));

    const bcrypt = require('bcryptjs');
    const { PasswordService } = require('./password.service');

    const service = new PasswordService();

    await service.hashPassword({
      email: 'a@a.com',
      password: '123',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('123pep', 1);
  });
});
