'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDocStore } from '@/stores/doc.store'

export default function DocHeader({ title, docId }: {
  title: string
  docId: string
}) {
  const [docTitle, setDocTitle] = useState(title)
  const { showSavedPulse, setSaveSignal } = useDocStore()

  const handleSave = async () => {
    setSaveSignal(true)
  }
  const handleTitleSave = async () => {
    console.log('Handle Title Save')
  }
  const handleFavorite = async () => {
    console.log('Handle Favorite')
  }
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <input
          value={docTitle}
          onChange={e => setDocTitle(e.target.value)}
          className="focus:outline-none text-[17px] font-medium"
          onBlur={handleTitleSave}
        />
      </div>
      <div className="flex items-center space-x-1.5">
        { showSavedPulse && (
          <p className="text-sm font-medium text-secondary-foreground">Saved!</p>
        )}
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" onClick={handleFavorite}>
          X
        </Button>
      </div>
    </div>
  )
}
