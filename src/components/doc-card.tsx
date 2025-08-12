import type { Document } from '@/generated/prisma'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DocCard({ doc }: { doc: Document }) {
  const handleDeleteDocument = async () => {
    console.log('Deleting document:', doc.id)
  }
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
          <p>Last Update</p>
        </div>
        <div>
          <Button variant="ghost">
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
