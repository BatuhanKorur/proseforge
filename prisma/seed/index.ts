import { prisma } from '@/lib/prisma'

async function main(){
    console.log('Seeding...')
}

main().then(async () => {
    await prisma.$disconnect()
    console.log('Database connection closed')
}).catch(async (error) => {
    console.error('Error while seeding:', error)
    await prisma.$disconnect()
    process.exit(1)
})
