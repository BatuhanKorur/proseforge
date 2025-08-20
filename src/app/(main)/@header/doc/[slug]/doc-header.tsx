'use client'
import { Bookmark } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { updateDocumentTitle } from '@/actions/doc.actions'
import { Button } from '@/components/ui/button'
import { useDocStore } from '@/stores/doc.store'
import { useUserStore } from '@/stores/user.store'

export default function DocHeader({ title, docId }: {
  title: string
  docId: string
}) {
  const originalTitleRef = useRef(title)
  const [docTitle, setDocTitle] = useState(title)

  const { isSaved, saveDocument } = useDocStore()
  const { favorites, setFavorite } = useUserStore()

  const handleTitleSave = async () => {
    if (docTitle !== originalTitleRef.current) {
      await updateDocumentTitle(docId, docTitle)
      originalTitleRef.current = docTitle // Update the reference to the new saved title
    }
  }

  const handleFavorite = async () => {
    setFavorite(docId, docTitle)
  }

  const isFavorite = useMemo(() => favorites.some(f => f.id === docId), [docId, favorites])
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <input
          value={docTitle}
          onChange={e => setDocTitle(e.target.value)}
          className="w-1/2 border border-border/0 focus:outline-none text-[16px] font-medium h-8 rounded-md px-2 transition duration-200 ease-in-out hover:border-border/100 focus:bg-muted"
          onBlur={handleTitleSave}
        />
      </div>
      <div className="flex items-center space-x-1.5">
        <p
          className={`text-sm font-medium text-success-foreground transition-opacity duration-300 ease-in-out pr-2 ${
            isSaved ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Saved!
        </p>
        <Button size="sm" onClick={() => saveDocument(docId)}>
          Save
        </Button>
        <Button
          size="icon"
          onClick={handleFavorite}
          variant={isFavorite ? 'empty' : 'outline'}
          className={isFavorite ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/25' : ''}
        >
          <Bookmark />
        </Button>
      </div>
    </div>
  )
}
