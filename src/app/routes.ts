import { Router } from 'express';
import { userRouter } from '@/modules/user';

const router = Router();

router.use('/users', userRouter);

export default router;
