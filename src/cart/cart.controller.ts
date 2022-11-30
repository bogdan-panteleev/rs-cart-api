import { Controller, Get, Req, HttpStatus, Post, Body } from '@nestjs/common';

import { Checkout, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    console.log('findUserCart is called with', req);

    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    console.log('Cart is retrieved ', cart);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(BasicAuthGuard)
  // @Put()
  // updateUserCart(@Req() req: AppRequest, @Body() body) {
  //   // TODO: validate body payload...
  //   const cart = this.cartService.updateByUserId(
  //     getUserIdFromRequest(req),
  //     body,
  //   );
  //
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'OK',
  //     data: {
  //       cart,
  //       total: calculateCartTotal(cart),
  //     },
  //   };
  // }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Delete()
  // clearUserCart(@Req() req: AppRequest) {
  //   this.cartService.removeByUserId(getUserIdFromRequest(req));
  //
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'OK',
  //   };
  // }

  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: Checkout) {
    console.log('checkout called');
    const userId = getUserIdFromRequest(req);
    console.log('user id is: ', userId);
    // const cart = this.cartService.findByUserId(userId);
    //
    // if (!(cart && cart.items.length)) {
    //   const statusCode = HttpStatus.BAD_REQUEST;
    //   req.statusCode = statusCode;
    //
    //   return {
    //     statusCode,
    //     message: 'Cart is empty',
    //   };
    // }
    //
    // const { id: cartId, items } = cart;
    // const total = calculateCartTotal(cart);
    // const order = this.orderService.create({
    //   ...body, // TODO: validate and pick only necessary data
    //   userId,
    //   cartId,
    //   items,
    //   total,
    // });
    // this.cartService.removeByUserId(userId);

    console.log('checkout is called with: ', body);
    try {
      const cart = await this.cartService.findByUserId(userId);
      await this.orderService.create(userId, cart.id, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { message: 'Created successfully' },
      };
    } catch (e) {
      console.log('Failed to create order', e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'OK',
        data: { message: 'Failed to create order' },
      };
    }
  }
}
