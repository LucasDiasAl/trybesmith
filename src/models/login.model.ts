import { Pool } from 'mysql2/promise';
import User from '../interfaces/user.interface';

type Login = {
  username: string,
  password: string,
};

export default class OrdersModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getUser(user: Login): Promise<User[]> {
    const [foundUser] = await this.connection.execute(
      `SELECT * FROM Trybesmith.users AS u
       WHERE u.username = ? AND u.password = ?`,
      [user.username, user.password],
    );
    return <User[]> foundUser;
  }
}
