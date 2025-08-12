'use client'
import type { Document } from '@/generated/prisma'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteDocument } from '@/actions/doc.actions'
import DateTime from '@/components/date-time'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function DocCard({ doc }: { doc: Document }) {
  return (
    <div className="border rounded-md bg-card">
      <Link href={`/doc/${doc.id}`}>
        <div className="px-4 pt-4">
          <p className="text-lg font-semibold">{ doc.title }</p>
        </div>
        <div className="py-4 px-4">
          <p>Content</p>
        </div>
      </Link>
      <div className="border-t px-4 py-2 flex items-center justify-between">
        <div>
          <DateTime className="text-sm text-muted-foreground" date={doc.updatedAt} />
        </div>
        <div>
          <DeleteButton id={doc.id} title={doc.title} />
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id, title }: { id: string, title: string }) {
  const handleDeleteDocument = async () => {
    console.log('Deleting document:', id)
    try {
      await deleteDocument(id)
    }
    catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the document
            <span className="font-semibold text-foreground">
              {' '}
              { title }
              {' '}
            </span>
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteDocument}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
