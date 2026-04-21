import { userController } from './user.controller';
import { userService } from './user.service';

jest.mock('./user.service');

describe('UserController.create', () => {
  it('returns 400 if validation fails', async () => {
    const req: any = { body: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 201 if success', async () => {
    (userService.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@mail.com',
      role: 'CLIENT',
    });

    const req: any = {
      body: { email: 'test@mail.com', password: '123456' },
    };

    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
