import { Pool, ResultSetHeader } from 'mysql2/promise';
import Product from '../interfaces/product.interface';
// import connectio from './connection';

export default class ProductModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async create(product: Product): Promise<Product> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.products (name, amount) VALUES (?,?)',
      [product.name, product.amount],
    );
    const { insertId } = result; 
    return { id: insertId, ...product };
  }
}

// const teste = async () => {
//   const model = new ProductModel(connectio);
//   await model.create({ name: 'Notebook', amount: '100' }).then(console.log);
// };

// teste();