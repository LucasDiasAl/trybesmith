import { Router } from 'express';
import ProductsController from '../controllers/products.controller';
import ProductsMiddleware from '../middlewares/products.validation';

const productsController = new ProductsController();
const productMiddleware = new ProductsMiddleware();
const router = Router();

router.post(
  '/', 
  productMiddleware.productValidation,

  productsController.createProduct,
);

router.get('/', productsController.getAllProducts);

export default router;