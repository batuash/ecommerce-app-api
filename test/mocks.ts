import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { Order, OrderStatus } from '../src/models/order.entity';
import { OrderItem } from '../src/models/order-item.entity';
import { Shipping, ShippingStatus, ShippingMethod } from '../src/models/shipping.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../src/models/payment.entity';
import { Product } from '../src/models/product.entity';
import { QueryRunner } from 'typeorm';

// Mock IDs
export const mockCurrency = 'USD';
export const mockAmount = 59.98;
export const mockOrderId = 'order-1';
export const mockProductId = 'product-1';
export const mockOrderItemId = 'order-item-1';
export const mockShippingId = 'shipping-1';
export const mockPaymentId = 'payment-1';

// Mock CreateOrderDto
export const mockCreateOrderDto: CreateOrderDto = {
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

// Mock Product
export const mockProduct: Product = {
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

// Mock OrderItem
export const mockOrderItem: OrderItem = {
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

// Mock Shipping
export const mockShipping: Shipping = {
  id: mockShippingId,
  orderId: mockOrderId,
  method: ShippingMethod.STANDARD,
  status: ShippingStatus.PENDING,
  firstName: mockCreateOrderDto.shipping.firstName,
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

// Mock Payment
export const mockPayment: Payment = {
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

// Mock Order
export const mockOrder: Order = {
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

// Mock Repository functions
export const mockOrdersRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
};

export const mockOrderItemsRepository = {
  save: jest.fn(),
};

export const mockShippingRepository = {
  save: jest.fn(),
};

export const mockPaymentRepository = {
  save: jest.fn(),
};

export const mockProductsRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
};

export const mockQueryRunner: any = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    },
  };

export const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

// Helper functions for creating variations of mock data
export const createMockOrderWithStatus = (status: OrderStatus): Order => ({
  ...mockOrder,
  status,
});

export const createMockOrderWithAmount = (amount: number): Order => ({
  ...mockOrder,
  subtotal: amount,
  totalAmount: amount,
});

export const createMockProductWithPrice = (price: number): Product => ({
  ...mockProduct,
  price,
});

export const createMockCreateOrderDtoWithEmail = (email: string): CreateOrderDto => ({
  ...mockCreateOrderDto,
  customerEmail: email,
});
