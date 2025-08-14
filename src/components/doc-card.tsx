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
  const { preview, id, title, updatedAt } = doc
  return (
    <div className="border rounded bg-card drop-shadow-md flex flex-col">
      <Link href={`/doc/${id}`} className="flex-1">
        <div className="px-4 py-4">
          <p className="text-md font-semibold">{ title }</p>
        </div>
        <div className="px-4 text-muted-foreground">
          { preview && <p className="text-sm line-clamp-3 leading-5.5">{preview}</p>}
        </div>
      </Link>
      <div className="border-t pl-4 pr-2 py-1.5 mt-4 flex items-center justify-between">
        <div>
          <DateTime className="text-xs text-muted-foreground" date={updatedAt} />
        </div>
        <div>
          <DeleteButton id={id} title={title} />
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id, title }: { id: string, title: string }) {
  const handleDeleteDocument = async () => {
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
        <Button variant="ghost" size="icon">
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
          <AlertDialogAction
            onClick={handleDeleteDocument}
            className="bg-destructive text-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
