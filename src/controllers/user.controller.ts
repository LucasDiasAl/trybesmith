import { Request, Response } from 'express';
import statusCodes from '../utils/statusCode';
import UserService from '../services/user.service';

class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  public createUser = async (req: Request, res: Response) => {
    const user = req.body;
    const token = await this.service.createUser(user);
    res.status(statusCodes.CREATED).json({ token });
  };
}

export default UserController;