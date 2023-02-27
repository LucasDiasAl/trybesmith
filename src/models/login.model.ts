import { Pool } from 'mysql2/promise';
import User from '../interfaces/user.interface';
// import connectio from './connection';

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

// const teste = async () => {
//   const model = new OrdersModel(connectio);
//   await model.getUser({ username: 'reig', password: '1dragaeu' }).then(console.log);
// };

// teste();