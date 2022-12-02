import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { ProfileController } from './profile.controller';
import { CartService } from './services';

@Module({
  imports: [OrderModule],
  providers: [CartService],
  controllers: [ProfileController],
})
export class CartModule {}
