import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PostgresModule } from 'nest-postgres';

@Module({
  imports: [
    AuthModule,
    PostgresModule.forRoot(
      {
        host:
          'cloudx-practitioner-js.cjc4wyehmjx5.eu-central-1.rds.amazonaws.com',
        port: 5432,
        database: 'bahdan-pantsialeyeu-cart-db',
        user: 'postgres',
        password: 'EQCYvYv9iNYU7krHGPrB',
        connectionTimeoutMillis: 5000,
      },
      'cartDbConnection',
    ),
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
