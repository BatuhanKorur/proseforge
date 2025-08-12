'use client'
import { useRouter } from 'next/navigation'
import { createDocument } from '@/actions/doc.actions'
import { Button } from '@/components/ui/button'

export default function DocHeading() {
  const router = useRouter()

  const handleNewDocument = async () => {
    try {
      const n = await createDocument()
      if (!n || !n.id) {
        console.log('No id')
        return // Don't proceed if no id is returned.
      }
      router.push(`/doc/${n.id}`)
    }
    catch (e) {
      console.log('Error creating new document:', e)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-semibold mt-4 mb-10">Docs</h1>
      <div>
        <Button
          className="text-sm"
          variant="outline"
          onClick={handleNewDocument}
        >
          New Document
        </Button>
      </div>
    </div>
  )
}
