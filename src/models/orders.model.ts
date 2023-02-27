import { Pool } from 'mysql2/promise';
import Orders from '../interfaces/order.interface';
// import connectio from './connection';

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
}

// const teste = async () => {
//   const model = new OrdersModel(connectio);
//   await model.getOrdersJoin().then(console.log);
// };

// teste();