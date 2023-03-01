import { Pool, ResultSetHeader } from 'mysql2/promise';
import Orders from '../interfaces/order.interface';

type NewOrders = {
  userId: string,
  productsIds: number[],
};

export default class OrdersModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getOrdersJoin(): Promise<Orders[]> {
    const [result] = await this.connection.execute(
      `SELECT o.id AS id, o.user_id AS userId, JSON_ARRAYAGG(p.id) AS productsIds
       FROM Trybesmith.orders AS o
       INNER JOIN Trybesmith.products AS p
       ON o.id = p.order_id
       GROUP BY o.user_id, o.id`,
    );
    return <Orders[]> result;
  }

  public async newOrder(userId: string, products: number[]): Promise<NewOrders> { 
    const [result] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.orders (user_id) VALUES (?)',
      [userId],
    );
    const { insertId } = result;
    const promises = products.map(async (productId) => {
      await this.connection.execute(
        `UPDATE Trybesmith.products 
         SET order_id = (?)
         WHERE id = (?)`,
        [insertId, productId],
      );
    });
    await Promise.all(promises);
    return <NewOrders> { userId, productsIds: products };
  }
}
