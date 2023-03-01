import { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user.service';
import User from '../interfaces/user.interface';

require('dotenv/config');

const secret = process.env.JWT_SECRET || 'secret'; 

export default class TokenValidation {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  public checkUser = (userId: string | null): void => {
    const user: Promise<User[]> = this.service.getUserById(userId);
    if (!user) throw new Error('User does not exist');
  };

  public validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      const payload: JwtPayload | string = jwt.verify(token, secret);
  
      const id: null | string = typeof payload === 'string' ? null : payload.data.id;
      if (typeof payload === 'string') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      this.checkUser(id);
      req.body = { userId: id, ...req.body };
      next();
    } catch (err) { 
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}
