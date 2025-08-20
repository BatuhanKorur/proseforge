'use client'

import type { Document } from '@/generated/prisma'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createDocument } from '@/actions/doc.actions'
import DocCard from '@/components/doc-card'
import ErrorLayout from '@/components/error-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const PAGE_SIZE = 10

export default function DocumentsBrowser({ docs }: { docs: Document[] }) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return docs
    }
    return docs.filter(d => (d.title || '').toLowerCase().includes(q))
  }, [docs, query])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, docs])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <div className="flex flex-col h-full px-4">
      <div className="flex flex-col mt-8 mb-4 md:flex-row md:w-full">
        <h1 className="text-3xl font-semibold mb-1 w-full">Documents</h1>
        <div className="flex items-center gap-3">
          { docs.length > 0 && (
            <Input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="min-w-64"
              placeholder="Search by title..."
              aria-label="Search documents by title"
            />
          )}
          <Button
            className="text-sm"
            variant="outline"
            onClick={handleNewDocument}
          >
            New Document
          </Button>
        </div>
      </div>

      { docs.length === 0 && (
        <ErrorLayout>
          No documents found. Create a new document to start exploring.
        </ErrorLayout>
      )}

      { docs.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.length > 0
              ? (
                  visible.map(doc => (
                    <DocCard doc={doc} key={doc.id} />
                  ))
                )
              : (
                  <p className="col-span-3 text-sm text-gray-500">No matching documents</p>
                )}
          </div>
          {filtered.length > 0 && (
            <div className="mt-6 flex items-center justify-center">
              {hasMore
                ? (
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    >
                      Load more
                    </Button>
                  )
                : (
                    <p className="text-xs text-gray-500">
                      Showing
                      {' '}
                      {visible.length}
                      {' '}
                      of
                      {' '}
                      {filtered.length}
                    </p>
                  )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
