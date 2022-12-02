import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '../models';
import { Client, QueryResult } from 'pg';
import { InjectConnection } from 'nest-postgres';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection('cartDbConnection')
    private dbConnection: Client,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const result = await this.dbConnection.query<Cart & CartItem>(
      `SELECT id, product_id, items_count from carts LEFT JOIN cart_items ON carts.id = cart_items.cart_id WHERE user_id = '${userId}';`,
    );
    if (result.rows.length === 0) {
      throw new Error(`No Cart for user ${userId}`);
    }
    return mapCart(result.rows, result.rows[0].id);
  }

  async createByUserId(userId: string): Promise<QueryResult> {
    console.log('createByUserId is called with userId:', userId);
    const cart = await this.dbConnection.query<Cart>(
      `insert into carts (created_at, updated_at, user_id) values ('2021-08-06', '2021-08-06', '${userId}');`,
    );
    console.log(`cart created for user with id ${userId}:`, cart);
    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    try {
      return await this.findByUserId(userId);
    } catch (e) {
      await this.createByUserId(userId);
    }
    return await this.findByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id } = await this.findOrCreateByUserId(userId);

    await this.dbConnection.query(
      `delete from cart_items where user_id = ${userId}`,
    );
    const updatedCartItems = await this.dbConnection.query(
      `insert into cart_items (cart_id, items_count, product_id) values (${items.map(
        item => `'${id}', ${item.count}, '${item.productId}'`,
      )});`,
    );

    return { id, items: updatedCartItems.rows };
  }
}

function mapCart(rows: (Cart & CartItem)[], cartId: string): Cart {
  return rows.reduce<Cart>(
    (cart, data) => {
      if (data.id === cart.id) {
        cart.items.push({
          productId: data['product_id'],
          count: data['items_count'],
        });
      }
      return cart;
    },
    {
      id: cartId,
      items: [],
    },
  );
}
