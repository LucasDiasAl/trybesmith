import { Request, Response } from 'express';
import statusCodes from '../utils/statusCode';
import ProductService from '../services/product.service';

class ProductsController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  public createProduct = async (req: Request, res: Response) => {
    const product = req.body;
    const insertedProduct = await this.service.create(product);
    res.status(statusCodes.CREATED).json(insertedProduct);
  };

  public getAllProducts = async (req: Request, res: Response) => {
    const products = await this.service.getAll();
    res.status(statusCodes.OK).json(products);
  };
}

export default ProductsController;