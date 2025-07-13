import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Running Shoes Pro',
        brand: 'Nike',
        category: 'Footwear',
        description: 'High-performance running shoes with advanced cushioning',
        usage: 'Running, jogging, fitness training',
        price: 129.99,
        imageUrl: 'https://example.com/nike-running-shoes.jpg'
      },
      {
        name: 'Wireless Headphones',
        brand: 'Sony',
        category: 'Electronics',
        description: 'Noise-canceling wireless headphones with 30-hour battery',
        usage: 'Music, calls, travel',
        price: 299.99,
        imageUrl: 'https://example.com/sony-headphones.jpg'
      },
      {
        name: 'Ergonomic Office Chair',
        brand: 'Herman Miller',
        category: 'Furniture',
        description: 'Premium ergonomic chair with lumbar support',
        usage: 'Office work, home office, long sitting sessions',
        price: 899.99,
        imageUrl: 'https://example.com/herman-miller-chair.jpg'
      },
      {
        name: 'Smartphone X1',
        brand: 'Apple',
        category: 'Electronics',
        description: 'Latest smartphone with advanced camera and AI features',
        usage: 'Communication, photography, productivity',
        price: 999.99,
        imageUrl: 'https://example.com/iphone-x1.jpg'
      },
      {
        name: 'Yoga Mat Premium',
        brand: 'Lululemon',
        category: 'Sports',
        description: 'Non-slip yoga mat with superior grip and cushioning',
        usage: 'Yoga, pilates, meditation, stretching',
        price: 78.99,
        imageUrl: 'https://example.com/lululemon-yoga-mat.jpg'
      }
    ]
  })

  console.log(`✅ Created ${products.count} products`)
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })