import { Router } from 'express';
import OrderController from '../controllers/orders.controller';
import TokenValidation from '../middlewares/tokenValidation';
import NewOrderValidation from '../middlewares/newOrder.validation';

const orderController = new OrderController();
const tokenValidation = new TokenValidation();
const newOrderValidation = new NewOrderValidation();
const router = Router();

router.get('/', orderController.getAllOrders);

router.post(
  '/',
  tokenValidation.validateToken,

  newOrderValidation.productValidation,

  orderController.newOrder,
);

export default router;