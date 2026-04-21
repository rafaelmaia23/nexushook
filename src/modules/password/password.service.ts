import { config } from '@/config/config';
import type { CreateUserInput } from '@/modules/user';
import bcrypt from 'bcryptjs';

export class PasswordService {
  private static SALT_ROUNDS =
    config.app.env === 'production' ? config.password.saltRounds : 1;
  private static PEPPER = config.password.pepper;

  hashPassword = async (user: CreateUserInput): Promise<CreateUserInput> => {
    const hash = await bcrypt.hash(
      user.password + PasswordService.PEPPER,
      PasswordService.SALT_ROUNDS,
    );

    return {
      ...user,
      password: hash,
    };
  };
}

export const passwordService = new PasswordService();
