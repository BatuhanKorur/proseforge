import { getDocumentById } from '@/actions/doc.actions'
import { DocPanel } from '@/app/(main)/doc/[slug]/doc-panel'
import DocView from '@/app/(main)/doc/[slug]/doc-view'

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  if (!slug)
    return null

  const doc = await getDocumentById(slug)
  if (!doc)
    return null

  return (
    <div className="flex h-[90dvh] overflow-hidden">
      <DocView doc={doc} />
      <DocPanel />
    </div>
  )
}
