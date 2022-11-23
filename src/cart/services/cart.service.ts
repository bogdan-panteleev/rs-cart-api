import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import { Client } from 'pg';
import { InjectConnection } from 'nest-postgres';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection('cartDbConnection')
    private dbConnection: Client,
  ) {}

  private userCarts: Record<string, Cart> = {};

  async findByUserId(_userId: string): Promise<Cart[]> {
    console.log('findByUserId has connection');
    const result = await this.dbConnection.query('SELECT * from carts');
    console.log('findByUserId has result ', result);
    return (result as unknown) as Cart[];
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[userId] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart[]> {
    console.log('findOrCreateByUserId is called');
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return [];

    // return this.createByUserId(userId);
  }

  updateByUserId(_userId: string, { items }: Cart): Cart {
    return {
      id: 'test',
      items: [],
    };
    // // const { id, ...rest } = this.findOrCreateByUserId(userId);
    //
    // const updatedCart = {
    //   id,
    //   ...rest,
    //   items: [...items],
    // };
    //
    // this.userCarts[userId] = { ...updatedCart };
    //
    // return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null;
  }
}
