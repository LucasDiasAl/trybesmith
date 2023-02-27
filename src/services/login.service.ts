import connection from '../models/connection';
import LoginModel from '../models/login.model';
import JwtGenerator from '../utils/JwtGenerator';

type Login = {
  username: string,
  password: string,
};
export default class LoginService {
  public model: LoginModel;

  constructor() {
    this.model = new LoginModel(connection);
  }

  public async LoginUser(userData: Login): Promise<string | null> { 
    const user = await this.model.getUser(userData);
    if (user.length === 0) {
      return null;
    }
    const payload = { id: user[0].id, username: user[0].username };
    const token = JwtGenerator(payload);
    return token;
  }
}