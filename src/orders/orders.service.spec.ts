import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { Shipping, ShippingStatus, ShippingMethod } from '../models/shipping.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../models/payment.entity';
import { Product } from '../models/product.entity';
import {
  mockCreateOrderDto,
  mockOrder,
  mockProduct,
  mockOrderId,
  mockProductId,
  mockAmount,
  mockQueryRunner,
  mockOrdersRepository,
  mockOrderItemsRepository,
  mockShippingRepository,
  mockPaymentRepository,
  mockProductsRepository,
  mockDataSource,
} from '../../test/mocks';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;  
  let orderItemsRepository: Repository<OrderItem>;
  let shippingRepository: Repository<Shipping>;
  let paymentRepository: Repository<Payment>;
  let productsRepository: Repository<Product>;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemsRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    shippingRepository = module.get<Repository<Shipping>>(getRepositoryToken(Shipping));
    paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = mockQueryRunner;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    beforeEach(() => {
      // Mock the findOne method to return the complete order with relations
      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrder);
    });

    it('should create an order successfully', async () => {
      // Mock product validation
      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      
      // Mock order creation and saving
      mockQueryRunner.manager.create.mockImplementation((entity, data) => ({
        ...data,
        id: 'generated-id',
      }));
      mockQueryRunner.manager.save.mockResolvedValue({ id: mockOrderId });

      const result = await service.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledWith(mockOrderId);
    });

    it('should throw BadRequestException when order items are empty', async () => {
      const invalidDto = { ...mockCreateOrderDto, orderItems: [] };

      await expect(service.createOrder(invalidDto)).rejects.toThrow(
        new BadRequestException('Order must contain at least one item'),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product is not found', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(
        new NotFoundException(`Product with ID ${mockProductId} not found`),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw BadRequestException when product stock is insufficient', async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 };
      mockQueryRunner.manager.findOne.mockResolvedValue(lowStockProduct);

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(
        new BadRequestException(
          `Insufficient stock for product ${mockProduct.name}. Available: 1, Requested: ${mockCreateOrderDto.orderItems[0].quantity}`,
        ),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const error = new Error('Database error');
      mockQueryRunner.manager.findOne.mockRejectedValue(error);

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(error);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should update product stock after successful order creation', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.create.mockImplementation((entity, data) => ({
        ...data,
        id: 'generated-id',
      }));
      mockQueryRunner.manager.save.mockResolvedValue({ id: mockOrderId });

      await service.createOrder(mockCreateOrderDto);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        Product,
        { id: mockProductId },
        { stock: 98 }, // 100 - 2
      );
    });
  });

  describe('findOne', () => {
    it('should return an order when found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(mockOrderId);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockOrderId },
        relations: ['orderItems', 'orderItems.product', 'shipping', 'payment'],
      });
    });

    it('should throw NotFoundException when order is not found', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        new NotFoundException('Order not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [mockOrder];
      mockOrdersRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrdersRepository.find).toHaveBeenCalledWith({
        relations: ['orderItems', 'orderItems.product', 'shipping', 'payment'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no orders exist', async () => {
      mockOrdersRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('validateAndCalculateOrderItems', () => {
    it('should validate and calculate order items correctly', async () => {
      const orderItems = [{ productId: mockProductId, quantity: 2 }];
      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);

      // Access the private method through the service instance
      const result = await (service as any).validateAndCalculateOrderItems(orderItems, mockQueryRunner);

      expect(result).toEqual({
        orderItems: [
          {
            productId: mockProductId,
            quantity: 2,
            product: mockProduct,
          },
        ],
        subtotal: mockAmount,
        totalAmount: mockAmount,
      });
    });

    it('should throw BadRequestException for empty order items', async () => {
      await expect(
        (service as any).validateAndCalculateOrderItems([], mockQueryRunner),
      ).rejects.toThrow(new BadRequestException('Order must contain at least one item'));
    });

    it('should throw BadRequestException for null order items', async () => {
      await expect(
        (service as any).validateAndCalculateOrderItems(null, mockQueryRunner),
      ).rejects.toThrow(new BadRequestException('Order must contain at least one item'));
    });
  });

  describe('generateOrderNumber', () => {
    it('should generate a unique order number', async () => {
      const orderNumber = await (service as any).generateOrderNumber();

      expect(orderNumber).toMatch(/^ORD-\d{13}-\d{3}$/);
    });

    it('should generate different order numbers on multiple calls', async () => {
      const orderNumber1 = await (service as any).generateOrderNumber();
      const orderNumber2 = await (service as any).generateOrderNumber();

      expect(orderNumber1).not.toEqual(orderNumber2);
    });
  });
});
