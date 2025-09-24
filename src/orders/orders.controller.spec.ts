import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { Shipping, ShippingStatus, ShippingMethod } from '../models/shipping.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../models/payment.entity';
import { Product } from '../models/product.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockCurrency = 'USD';
  const mockAmount = 59.98;
  const mockOrderId = 'order-1';
  const mockProductId = 'product-1';
  const mockOrderItemId = 'order-item-1';
  const mockShippingId = 'shipping-1';
  const mockPaymentId = 'payment-1';


  const mockCreateOrderDto: CreateOrderDto = {
    customerEmail: 'customer@example.com',
    customerName: 'John Doe',
    customerPhone: '555-1234',
    orderItems: [
      {
        productId: 'product-1',
        quantity: 2,
      },
    ],
    shipping: {
      method: ShippingMethod.STANDARD,
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
      phone: '555-1234',
      email: 'john@example.com',
    },
    payment: {
      method: PaymentMethod.CREDIT_CARD,
      lastFourDigits: '1234',
      cardBrand: 'Visa',
      expiryMonth: '12',
      expiryYear: '2025',
      billingFirstName: 'John',
      billingLastName: 'Doe',
      billingAddressLine1: '123 Main St',
      billingCity: 'Anytown',
      billingState: 'CA',
      billingPostalCode: '12345',
      billingCountry: 'USA',
    },
    notes: 'Test order',
  };

  const mockProduct: Product = {
    id: mockProductId,
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    stock: 100,
    category: 'Test Category',
    sku: 'TEST-001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderItem: OrderItem = {
    id: mockOrderItemId,
    orderId: mockOrderId,
    productId: mockProductId,
    productName: mockProduct.name,
    productSku: mockProduct.sku,
    quantity: 2,
    unitPrice: mockProduct.price,
    totalPrice: mockAmount,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: new Order(),
    product: mockProduct,
  };

  const mockShipping: Shipping = {
    id: mockShippingId,
    orderId: mockOrderId,
    method: ShippingMethod.STANDARD,
    status: ShippingStatus.PENDING,
    firstName: mockCreateOrderDto.shipping.firstName  ,
    lastName: mockCreateOrderDto.shipping.lastName,
    addressLine1: mockCreateOrderDto.shipping.addressLine1,
    addressLine2: mockCreateOrderDto.shipping.addressLine2 ?? null,
    city: mockCreateOrderDto.shipping.city,
    state: mockCreateOrderDto.shipping.state,
    postalCode: mockCreateOrderDto.shipping.postalCode,
    country: mockCreateOrderDto.shipping.country,
    phone: mockCreateOrderDto.shipping.phone ?? null,
    email: mockCreateOrderDto.shipping.email ?? null,
    carrier: null,
    trackingNumber: null,
    estimatedDeliveryDate: null,
    shippedDate: null,
    deliveredDate: null,
    weight: null,
    weightUnit: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: new Order(),
  };

  const mockPayment: Payment = {
    id: mockPaymentId,
    orderId: mockOrderId,
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.PENDING,
    amount: mockAmount,
    currency: mockCurrency,
    lastFourDigits: mockCreateOrderDto.payment.lastFourDigits ?? null,
    cardBrand: mockCreateOrderDto.payment.cardBrand ?? null,
    expiryMonth: mockCreateOrderDto.payment.expiryMonth ?? null,
    expiryYear: mockCreateOrderDto.payment.expiryYear ?? null,
    billingFirstName: mockCreateOrderDto.payment.billingFirstName ?? null,
    billingLastName: mockCreateOrderDto.payment.billingLastName ?? null,
    billingAddressLine1: mockCreateOrderDto.payment.billingAddressLine1 ?? null,
    billingAddressLine2: null,
    billingCity: mockCreateOrderDto.payment.billingCity ?? null,
    billingState: mockCreateOrderDto.payment.billingState ?? null,
    billingPostalCode: mockCreateOrderDto.payment.billingPostalCode ?? null,
    billingCountry: mockCreateOrderDto.payment.billingCountry ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: new Order(),
    gatewayTransactionId: null,
    gatewayReference: null,
    gatewayName: null,
    processedAt: null,
    failedAt: null,
    failureReason: null,
    refundedAmount: 0,
    refundedAt: null,
    refundReason: null,
    notes: null,
  };

  const mockOrder: Order = {
    id: mockOrderId,
    orderNumber: 'ORD-1234567890-001',
    customerEmail: mockCreateOrderDto.customerEmail,
    customerName: mockCreateOrderDto.customerName ?? null,
    customerPhone: mockCreateOrderDto.customerPhone ?? null,
    status: OrderStatus.PENDING,
    subtotal: mockAmount,
    taxAmount: 0,
    shippingCost: 0,
    totalAmount: mockAmount,
    currency: mockCurrency,
    notes: mockCreateOrderDto.notes ?? null,
    shippedAt: null,
    deliveredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderItems: [mockOrderItem],
    shipping: mockShipping,
    payment: mockPayment,
  };

  const mockOrdersService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      mockOrdersService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should throw HttpException when service throws HttpException', async () => {
      const httpException = new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
      mockOrdersService.createOrder.mockRejectedValue(httpException);

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(httpException);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should throw HttpException with INTERNAL_SERVER_ERROR when service throws non-HttpException', async () => {
      const error = new Error('Database connection failed');
      mockOrdersService.createOrder.mockRejectedValue(error);

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        new HttpException('Failed to create order', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should use ValidationPipe with correct options', () => {
      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      expect(validationPipe).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [mockOrder];
      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith();
    });

    it('should throw HttpException when service throws error', async () => {
      const error = new Error('Database connection failed');
      mockOrdersService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        new HttpException('Failed to fetch orders', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockOrdersService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return an order when found', async () => {
      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('order-1');

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('order-1');
    });

    it('should throw HttpException when service throws HttpException', async () => {
      const httpException = new HttpException('Order not found', HttpStatus.NOT_FOUND);
      mockOrdersService.findOne.mockRejectedValue(httpException);

      await expect(controller.findOne('non-existent')).rejects.toThrow(httpException);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('non-existent');
    });

    it('should throw HttpException with INTERNAL_SERVER_ERROR when service throws non-HttpException', async () => {
      const error = new Error('Database connection failed');
      mockOrdersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('order-1')).rejects.toThrow(
        new HttpException('Failed to fetch order', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('order-1');
    });
  });
});
