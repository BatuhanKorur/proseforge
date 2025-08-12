import { prisma } from '@/lib/prisma'
export default async function DocSeed(){
    const documents = [
        {
            title: 'Interesting Article',
            content: JSON.stringify({ type: 'doc', content: [] }),
        },
        {
            title: 'Elephants are Cool',
            content: JSON.stringify({ type: 'doc', content: [] }),
        },
        {
            title: 'I like beer',
            content: JSON.stringify({ type: 'doc', content: [] }),
        }
    ]

    try {
        for(const doc of documents){
            await prisma.document.create({ data: doc });
        }
        console.log('Documents seeded successfully')
    } catch (error) {
        console.error('Error while seeding documents:', error)
        throw error
    }
}
