import { userService } from './user.service';
import { userRepository } from './user.repository';
import { passwordService } from '@/modules/password';

jest.mock('./user.repository', () => ({
  userRepository: {
    create: jest.fn(),
  },
}));

jest.mock('@/modules/password', () => ({
  passwordService: {
    hashPassword: jest.fn(),
  },
}));

describe('UserService.create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates user with hashed password and default role', async () => {
    (passwordService.hashPassword as jest.Mock).mockResolvedValue({
      email: 'mail@test.com',
      password: 'hashedPassword',
      role: undefined,
    });

    (userRepository.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: 'mail@test.com',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await userService.create({
      email: 'mail@test.com',
      password: 'plainPassword',
    });

    expect(passwordService.hashPassword).toHaveBeenCalledWith({
      email: 'mail@test.com',
      password: 'plainPassword',
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'mail@test.com',
      passwordHash: 'hashedPassword',
      role: 'CLIENT',
    });

    expect(result).toMatchObject({
      id: 'user-id',
      email: 'mail@test.com',
      role: 'CLIENT',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    expect(result.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(result.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('uses provided role if exists', async () => {
    (passwordService.hashPassword as jest.Mock).mockResolvedValue({
      email: 'mail@test.com',
      password: 'hashedPassword',
      role: 'ADMIN',
    });

    (userRepository.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'mail@test.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userService.create({
      email: 'mail@test.com',
      password: '123',
      role: 'ADMIN',
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'mail@test.com',
      passwordHash: 'hashedPassword',
      role: 'ADMIN',
    });
  });

  it('propagates repository error', async () => {
    (passwordService.hashPassword as jest.Mock).mockResolvedValue({
      email: 'mail@test.com',
      password: 'hashedPassword',
    });

    (userRepository.create as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    await expect(
      userService.create({
        email: 'mail@test.com',
        password: '123',
      }),
    ).rejects.toThrow('DB error');
  });
});
