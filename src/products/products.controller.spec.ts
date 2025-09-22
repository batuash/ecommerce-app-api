import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../models/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 10.99,
      stock: 100,
      category: 'Test Category',
      sku: 'TEST-001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 20.99,
      stock: 50,
      category: 'Test Category',
      sku: 'TEST-002',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockProductsService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn().mockImplementation((id: string) => {
      const product = mockProducts.find((p) => p.id === id);
      return Promise.resolve(product || null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockProductsService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockProducts[0]);
      expect(mockProductsService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw HttpException when product not found', async () => {
      mockProductsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(
        'Product not found',
      );
    });
  });
});
