'use server'
import {prisma} from '@/lib/prisma'

export default async function getDocuments(){
    try {
        return await prisma.document.findMany()
    } catch (e) {
        console.error('Error fetching documents:', e)
    }
}
