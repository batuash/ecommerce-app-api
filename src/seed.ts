import { AppDataSource } from './data-source';
import { Product } from './models/product.entity';

const demoProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    stock: 50,
    category: 'Electronics',
    sku: 'WBH-001',
    isActive: true,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt, available in multiple colors.',
    price: 29.99,
    stock: 100,
    category: 'Clothing',
    sku: 'OCT-001',
    isActive: true,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
    price: 24.99,
    stock: 75,
    category: 'Accessories',
    sku: 'SSB-001',
    isActive: true,
  },
  {
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    price: 149.99,
    stock: 30,
    category: 'Electronics',
    sku: 'SFT-001',
    isActive: true,
  },
  {
    name: 'Leather Laptop Bag',
    description: 'Premium leather laptop bag with multiple compartments and padded protection.',
    price: 89.99,
    stock: 25,
    category: 'Accessories',
    sku: 'LLB-001',
    isActive: true,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    stock: 60,
    category: 'Electronics',
    sku: 'WCP-001',
    isActive: true,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials with carrying strap.',
    price: 49.99,
    stock: 40,
    category: 'Sports',
    sku: 'YMP-001',
    isActive: true,
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    price: 179.99,
    stock: 15,
    category: 'Home & Kitchen',
    sku: 'CMD-001',
    isActive: true,
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Waterproof portable Bluetooth speaker with 360-degree sound.',
    price: 79.99,
    stock: 45,
    category: 'Electronics',
    sku: 'BSP-001',
    isActive: true,
  },
  {
    name: 'Running Shoes Athletic',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh.',
    price: 129.99,
    stock: 80,
    category: 'Sports',
    sku: 'RSA-001',
    isActive: true,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
    price: 34.99,
    stock: 35,
    category: 'Home & Kitchen',
    sku: 'LDL-001',
    isActive: true,
  },
  {
    name: 'Phone Case Protective',
    description: 'Shock-absorbing phone case with raised edges for screen protection.',
    price: 19.99,
    stock: 120,
    category: 'Accessories',
    sku: 'PCP-001',
    isActive: true,
  },
  {
    name: 'Protein Powder Vanilla',
    description: 'Whey protein powder with natural vanilla flavor, 2lb container.',
    price: 44.99,
    stock: 20,
    category: 'Sports',
    sku: 'PPV-001',
    isActive: true,
  },
  {
    name: 'Mechanical Keyboard Gaming',
    description: 'RGB backlit mechanical gaming keyboard with customizable keys.',
    price: 119.99,
    stock: 18,
    category: 'Electronics',
    sku: 'MKG-001',
    isActive: true,
  },
  {
    name: 'Travel Backpack 40L',
    description: 'Durable travel backpack with laptop compartment and multiple pockets.',
    price: 69.99,
    stock: 32,
    category: 'Accessories',
    sku: 'TB40-001',
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Get the product repository
    const productRepository = AppDataSource.getRepository(Product);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      console.log(`⚠️  Found ${existingProducts} existing products. Clearing them first...`);
      await productRepository.clear();
    }

    // Insert demo products
    console.log('📦 Inserting demo products...');
    const products = productRepository.create(demoProducts);
    await productRepository.save(products);

    console.log(`✅ Successfully seeded ${demoProducts.length} products!`);
    
    // Display summary
    const categories = [...new Set(demoProducts.map(p => p.category))];
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total Products: ${demoProducts.length}`);
    console.log(`   Categories: ${categories.join(', ')}`);
    console.log(`   Price Range: $${Math.min(...demoProducts.map(p => p.price))} - $${Math.max(...demoProducts.map(p => p.price))}`);
    
    // Show some sample products
    console.log('\n🛍️  Sample Products:');
    const sampleProducts = await productRepository.find({ take: 3 });
    sampleProducts.forEach(product => {
      console.log(`   • ${product.name} - $${product.price} (${product.stock} in stock)`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seed function
seedDatabase();
