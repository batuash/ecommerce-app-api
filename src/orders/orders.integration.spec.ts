import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  DataSource } from 'typeorm';
import request from 'supertest';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { Shipping, ShippingMethod } from '../models/shipping.entity';
import { Payment, PaymentMethod } from '../models/payment.entity';
import { Product } from '../models/product.entity';
import {
  mockCreateOrderDto,
  mockOrder,
  mockOrdersRepository,
  mockOrderItemsRepository,
  mockShippingRepository,
  mockPaymentRepository,
  mockProductsRepository,
  mockDataSource,
} from '../test/mocks';

describe('Orders Integration Tests', () => {
  let app: INestApplication;
  let ordersService: OrdersService;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrdersRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemsRepository,
        },
        {
          provide: getRepositoryToken(Shipping),
          useValue: mockShippingRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    
    ordersService = moduleFixture.get<OrdersService>(OrdersService);

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should return 400 for invalid email', async () => {
      const invalidDto = { ...mockCreateOrderDto, customerEmail: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for empty order items', async () => {
      const invalidDto = { ...mockCreateOrderDto, orderItems: [] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 500 when service throws error', async () => {
      // Create a valid DTO that passes validation but fails in service
      const validDto = {
        customerEmail: mockCreateOrderDto.customerEmail,
        orderItems: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1 }],
        shipping: {
          method: ShippingMethod.STANDARD,
          firstName: mockCreateOrderDto.shipping.firstName,
          lastName: mockCreateOrderDto.shipping.lastName,
          addressLine1: mockCreateOrderDto.shipping.addressLine1,
          city: mockCreateOrderDto.shipping.city,
          state: mockCreateOrderDto.shipping.state,
          postalCode: mockCreateOrderDto.shipping.postalCode,
          country: mockCreateOrderDto.shipping.country,
        },
        payment: {
          method: PaymentMethod.CREDIT_CARD,
        },
      };

      jest.spyOn(ordersService, 'createOrder').mockRejectedValue(new Error('Service error'));

      await request(app.getHttpServer())
        .post('/orders')
        .send(validDto)
        .expect(500);
    });
  });

  describe('GET /orders', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [mockOrder];
      jest.spyOn(ordersService, 'findAll').mockResolvedValue(mockOrders);

      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(response.body).toMatchObject([{
        id: mockOrder.id,
        customerEmail: mockOrder.customerEmail,
        status: mockOrder.status,
        totalAmount: mockOrder.totalAmount,
      }]);
      expect(ordersService.findAll).toHaveBeenCalledWith();
    });

    it('should return 500 when service throws error', async () => {
      jest.spyOn(ordersService, 'findAll').mockRejectedValue(new Error('Service error'));

      await request(app.getHttpServer())
        .get('/orders')
        .expect(500);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a specific order', async () => {
      jest.spyOn(ordersService, 'findOne').mockResolvedValue(mockOrder);

      const response = await request(app.getHttpServer())
        .get('/orders/order-1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: mockOrder.id,
        customerEmail: mockOrder.customerEmail,
        status: mockOrder.status,
        totalAmount: mockOrder.totalAmount,
      });
      expect(ordersService.findOne).toHaveBeenCalledWith('order-1');
    });

    it('should return 404 for non-existent order', async () => {
      jest.spyOn(ordersService, 'findOne').mockRejectedValue(new NotFoundException('Order not found'));

      await request(app.getHttpServer())
        .get('/orders/non-existent-id')
        .expect(404);
    });

    it('should return 500 when service throws non-http error', async () => {
      jest.spyOn(ordersService, 'findOne').mockRejectedValue(new Error('Service error'));

      await request(app.getHttpServer())
        .get('/orders/order-1')
        .expect(500);
    });
  });

  describe('Service Integration', () => {
    it('should handle validation errors properly', async () => {
      const invalidDto = {
        customerEmail: 'invalid-email',
        orderItems: [],
        shipping: {},
        payment: {},
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });

    it('should handle missing required fields', async () => {
      const incompleteDto = {
        customerEmail: 'test@example.com',
        // Missing orderItems, shipping, payment
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(incompleteDto)
        .expect(400);
    });
  });
});