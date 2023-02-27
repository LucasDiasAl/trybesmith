import { Request, Response } from 'express';
import statusCodes from '../utils/statusCode';
import LoginService from '../services/login.service';

export default class LoginController {
  private service: LoginService;

  constructor() {
    this.service = new LoginService();
  }

  public login = async (req: Request, res: Response) => {
    const token = await this.service.LoginUser(req.body);
    if (!token) return res.status(401).json({ message: 'Username or password invalid' });
    res.status(statusCodes.OK).json({ token });
  };
}