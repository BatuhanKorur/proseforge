import { getDocumentById } from '@/actions/doc.actions'
import DocEditor from '@/app/(main)/doc/[slug]/doc-editor'
import { DocInspector } from '@/app/(main)/doc/[slug]/doc-inspector'
import ErrorLayout from '@/components/error-layout'

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug) {
    return <ErrorLayout>Document not found</ErrorLayout>
  }

  const doc = await getDocumentById(slug)
  if (!doc) {
    return <ErrorLayout>Document not found</ErrorLayout>
  }

  return (
    <div className="flex h-[90dvh] overflow-hidden">
      <DocEditor doc={doc} />
      <DocInspector />
    </div>
  )
}
