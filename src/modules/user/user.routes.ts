import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.post('/', userController.create);

export { router as userRouter };
