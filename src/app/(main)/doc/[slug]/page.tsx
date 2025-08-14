import { getDocumentById } from '@/actions/doc.actions'
import DocEditor from '@/app/(main)/doc/[slug]/doc-editor'
import { DocInspector } from '@/app/(main)/doc/[slug]/doc-inspector'

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  if (!slug)
    return null

  const doc = await getDocumentById(slug)
  if (!doc)
    return null

  return (
    <div className="flex h-[90dvh] overflow-hidden">
      <DocEditor doc={doc} />
      <DocInspector />
    </div>
  )
}
