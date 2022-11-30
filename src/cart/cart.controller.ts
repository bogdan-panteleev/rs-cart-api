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
    console.log('checkout is called with: ', body);

    const userId = getUserIdFromRequest(req);
    if (userId === null) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        // message: 'OK',
        data: { message: 'No auth info was provided' },
      };
    }

    console.log('user id is: ', userId);
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
