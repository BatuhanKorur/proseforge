import { faker } from '@faker-js/faker'
import { prisma } from '@/lib/prisma'

export default async function DocSeed() {
  const titleSet = new Set<string>()
  while (titleSet.size < 40) {
    titleSet.add(faker.word.words({ count: { min: 2, max: 4 } }))
  }
  const titles = [...titleSet]
  const documents = titles.map(title => ({ title, content: JSON.stringify({ type: 'doc', content: [] }) }))
  try {
    for (const doc of documents) {
      await prisma.document.create({ data: doc })
    }
    console.log('Documents seeded successfully')
  }
  catch (error) {
    console.error('Error while seeding documents:', error)
    throw error
  }
}
