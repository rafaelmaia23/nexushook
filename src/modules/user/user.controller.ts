import type { Request, Response } from 'express';
import { createUserSchema } from './user.schema';
import { z } from 'zod';
import { userService } from './user.service';

export class UserController {
  create = async (req: Request, res: Response) => {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json(z.treeifyError(parsed.error));
    }

    const user = await userService.create(parsed.data);

    return res.status(201).json(user);
  };
}

export const userController = new UserController();
