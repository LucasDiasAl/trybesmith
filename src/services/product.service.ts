import connection from '../models/connection';
import ProductModel from '../models/products.model';
import Product from '../interfaces/product.interface';

class ProductService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  async create(product: Product): Promise<Product> {
    return this.model.create(product);
  }
}

export default ProductService;