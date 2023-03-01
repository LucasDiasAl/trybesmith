import { Pool, ResultSetHeader } from 'mysql2/promise';
import Product from '../interfaces/product.interface';

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

  public async getAll(): Promise<Product[]> {
    const [result] = await this.connection.execute(
      'SELECT * FROM Trybesmith.products',
    );
    return <Product[]> result;
  }
}
