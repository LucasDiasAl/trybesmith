import connection from '../models/connection';
import OrdersModel from '../models/orders.model';
import Orders from '../interfaces/order.interface';

export default class OrderService {
  public model: OrdersModel;

  constructor() {
    this.model = new OrdersModel(connection);
  }

  public getAllOrders(): Promise<Orders[]> {
    return this.model.getOrdersJoin();
  }
}