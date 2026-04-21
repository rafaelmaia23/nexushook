import { userRepository } from './user.repository';
import type { CreateUserInput } from './user.schema';
import { passwordService } from '@/modules/password';

export class UserService {
  async create(data: CreateUserInput) {
    const createUserInputWithHash = await passwordService.hashPassword(data);

    const user = await userRepository.create({
      email: createUserInputWithHash.email,
      passwordHash: createUserInputWithHash.password,
      role: createUserInputWithHash.role || 'CLIENT',
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const userService = new UserService();
