import { Pool, ResultSetHeader } from 'mysql2/promise';
import User from '../interfaces/user.interface';

export default class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async createUser(user: User): Promise<User> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.users (username,vocation, level, password) VALUES (?,?,?,?)',
      [user.username, user.vocation, user.level, user.password],
    );
    const { insertId } = result;
    return { id: insertId, ...user };
  }

  public async getUserById(userId: string | null): Promise<User[]> {
    const [user] = await this.connection.execute(
      'SELECT * FROM Trybesmith.users WHERE id = ?',
      [userId],
    );
    return <User[]> user;
  }
}
