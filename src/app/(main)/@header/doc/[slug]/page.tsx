import { getDocumentById } from '@/actions/doc.actions'
import DocHeader from '@/app/(main)/@header/doc/[slug]/doc-header'

export default async function DocumentHeader({ params }: { params: { slug: string } }) {
  const { slug } = params
  const doc = await getDocumentById(slug)

  if (!doc) {
    return <></>
  }

  return (
    <>
      <DocHeader title={doc.title} docId={doc.id} />
    </>
  )
}
