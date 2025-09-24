import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { Shipping, ShippingStatus } from '../models/shipping.entity';
import { Payment, PaymentStatus } from '../models/payment.entity';
import { Product } from '../models/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate products and calculate totals
      const { orderItems, subtotal, totalAmount } = await this.validateAndCalculateOrderItems(
        createOrderDto.orderItems,
        queryRunner,
      );

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        customerEmail: createOrderDto.customerEmail,
        customerName: createOrderDto.customerName,
        customerPhone: createOrderDto.customerPhone,
        status: OrderStatus.PENDING,
        subtotal,
        taxAmount: 0, // TODO: Implement tax calculation
        shippingCost: 0, // TODO: Implement shipping cost calculation
        totalAmount,
        currency: 'USD',
        notes: createOrderDto.notes,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items
      const orderItemsEntities = orderItems.map((item) =>
        queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          productName: item.product.name,
          productSku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        }),
      );

      await queryRunner.manager.save(orderItemsEntities);

      // Create shipping
      const shipping = queryRunner.manager.create(Shipping, {
        orderId: savedOrder.id,
        method: createOrderDto.shipping.method,
        status: ShippingStatus.PENDING,
        firstName: createOrderDto.shipping.firstName,
        lastName: createOrderDto.shipping.lastName,
        addressLine1: createOrderDto.shipping.addressLine1,
        addressLine2: createOrderDto.shipping.addressLine2,
        city: createOrderDto.shipping.city,
        state: createOrderDto.shipping.state,
        postalCode: createOrderDto.shipping.postalCode,
        country: createOrderDto.shipping.country,
        phone: createOrderDto.shipping.phone,
        email: createOrderDto.shipping.email,
      });

      await queryRunner.manager.save(shipping);

      // Create payment
      const payment = queryRunner.manager.create(Payment, {
        orderId: savedOrder.id,
        method: createOrderDto.payment.method,
        status: PaymentStatus.PENDING,
        amount: totalAmount,
        currency: 'USD',
        lastFourDigits: createOrderDto.payment.lastFourDigits,
        cardBrand: createOrderDto.payment.cardBrand,
        expiryMonth: createOrderDto.payment.expiryMonth,
        expiryYear: createOrderDto.payment.expiryYear,
        billingFirstName: createOrderDto.payment.billingFirstName,
        billingLastName: createOrderDto.payment.billingLastName,
        billingAddressLine1: createOrderDto.payment.billingAddressLine1,
        billingAddressLine2: createOrderDto.payment.billingAddressLine2,
        billingCity: createOrderDto.payment.billingCity,
        billingState: createOrderDto.payment.billingState,
        billingPostalCode: createOrderDto.payment.billingPostalCode,
        billingCountry: createOrderDto.payment.billingCountry,
      });

      await queryRunner.manager.save(payment);

      // Update product stock
      for (const item of orderItems) {
        await queryRunner.manager.update(
          Product,
          { id: item.productId },
          { stock: item.product.stock - item.quantity },
        );
      }

      await queryRunner.commitTransaction();

      // Return the complete order with relations
      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product', 'shipping', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['orderItems', 'orderItems.product', 'shipping', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  private async validateAndCalculateOrderItems(
    orderItems: { productId: string; quantity: number }[],
    queryRunner: any,
  ): Promise<{ orderItems: Array<{ productId: string; quantity: number; product: Product }>; subtotal: number; totalAmount: number }> {
    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const validatedItems: { productId: string; quantity: number; product: Product }[] = [];
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: item.productId, isActive: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        product,
      });
    }

    const taxAmount = 0; // TODO: Implement tax calculation
    const shippingCost = 0; // TODO: Implement shipping cost calculation
    const totalAmount = subtotal + taxAmount + shippingCost;

    return {
      orderItems: validatedItems,
      subtotal,
      totalAmount,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}
