import { Request, Response } from 'express';
import statusCodes from '../utils/statusCode';
import OrderService from '../services/order.service';

export default class OrderController {
  private service: OrderService;

  constructor() {
    this.service = new OrderService();
  }

  public getAllOrders = async (req: Request, res: Response) => {
    const orders = await this.service.getAllOrders();
    res.status(statusCodes.OK).json(orders);
  };

  public newOrder = async (req: Request, res: Response) => {
    const { userId, productsIds } = req.body;
    const userOrder = await this.service.newOrder(userId, productsIds);
    res.status(statusCodes.CREATED).json(userOrder);
  };
}