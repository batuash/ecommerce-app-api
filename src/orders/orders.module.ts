import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { Shipping } from '../models/shipping.entity';
import { Payment } from '../models/payment.entity';
import { Product } from '../models/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Shipping,
      Payment,
      Product,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
