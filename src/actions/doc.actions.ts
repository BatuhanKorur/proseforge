'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function getDocuments() {
  try {
    return await prisma.document.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }
  catch {
    return false
  }
}

export async function getDocumentById(id: string) {
  try {
    return await prisma.document.findFirst({ where: { id } })
  }
  catch {
    return false
  }
}

export async function persistDocument(docId: string, content: string, preview: string) {
  try {
    await prisma.document.update({
      where: { id: docId },
      data: {
        content,
        preview,
      },
    })
  }
  catch {
    return false
  }
}

export async function updateDocumentTitle(docId: string, title: string) {
  try {
    await prisma.document.update({
      where: { id: docId },
      data: { title },
    })
  }
  catch (error) {
    console.error('Error updating document title:', error)
  }
}

export async function createDocument() {
  try {
    return await prisma.document.create({
      data: {
        title: 'Untitled',
        content: JSON.stringify({ type: 'doc', content: [] }),
      },
    })
  }
  catch (error) {
    console.error('Error creating document:', error)
  }
}

export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({ where: { id } })
    revalidatePath('/')
  }
  catch (error) {
    console.error('Error deleting document:', error)
  }
}
