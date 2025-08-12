'use server'
import {prisma} from '@/lib/prisma'
import { Document } from "@/generated/prisma"

export async function getDocuments(){
    try {
        return await prisma.document.findMany()
    } catch (e) {
        console.error('Error fetching documents:', e)
    }
}

export async function getDocumentById(id: string){
    try {
        return await prisma.document.findFirst({ where: { id } })
    } catch (e) {
        console.error('Error fetching document:', e)
    }
}

export async function persistDocument(docId: string, content: string){
    try {
        await prisma.document.update({
            where: { id: docId },
            data: { content },
        })
    }
    catch (error) {
        console.error('Error saving document:', error)
    }
}
