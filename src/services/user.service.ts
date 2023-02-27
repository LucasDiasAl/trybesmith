import connection from '../models/connection';
import UserModel from '../models/user.model';
import User from '../interfaces/user.interface';
import JwtGenerator from '../utils/JwtGenerator';

export default class UserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  public async createUser(user: User): Promise<string> {
    const newUser = await this.model.createUser(user);
    const { id, username } = newUser;
    const payload = { id, username };
    const token = JwtGenerator(payload);
    return token;
  }
}