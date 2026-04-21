import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'CLIENT']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
