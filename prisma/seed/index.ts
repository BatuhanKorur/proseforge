import { prisma } from '@/lib/prisma'
import DocSeed from './doc.seed'

async function main() {
  console.log('Seeding...')
  try {
    await DocSeed()
  }
  catch (e) {
    console.error('Error on seed')
  }
}

main().then(async () => {
  await prisma.$disconnect()
  console.log('Database connection closed')
}).catch(async (error) => {
  console.error('Error while seeding:', error)
  await prisma.$disconnect()
  process.exit(1)
})
