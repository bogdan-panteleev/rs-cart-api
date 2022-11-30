import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import { ProductCheckout } from '../../cart';
import { InjectConnection } from 'nest-postgres';
import { Client } from 'pg';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection('cartDbConnection')
    private dbConnection: Client,
  ) {}

  private orders: Record<string, Order> = {};

  findById(orderId: string): Order {
    return this.orders[orderId];
  }

  async create(userId: string, cartId: string, data: Checkout): Promise<void> {
    try {
      const query = `insert into orders (last_name, first_name, address, comment, cart_id) values ('${data.shipping.lastName}', '${data.shipping.firstName}', '${data.shipping.address}', '${data.shipping.comment}', '${cartId}');`;
      console.log('create order query: ', query);
      await this.dbConnection.query(query);
    } catch (e) {
      console.log('create failed', e);
      throw new Error(`Error while creating order ${e}`);
    }
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[orderId] = {
      ...data,
      id: orderId,
    };
  }
}

export interface Checkout {
  products: ProductCheckout[];
  shipping: {
    lastName: string;
    firstName: string;
    address: string;
    comment: string;
  };
}
