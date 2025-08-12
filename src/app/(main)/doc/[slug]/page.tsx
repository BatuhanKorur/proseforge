import { getDocumentById } from '@/actions/doc.actions'
import DocEditor from '@/app/(main)/doc/[slug]/DocEditor'

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  if (!slug)
    return null

  const doc = await getDocumentById(slug)
  if (!doc)
    return null

  return (
    <>
      <DocEditor doc={doc} />
    </>
  )
}
