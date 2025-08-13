import { getDocuments } from '@/actions/doc.actions'
import PageHeading from '@/app/(main)/page-heading'
import DocCard from '@/components/doc-card'

export default async function MainPage() {
  const docs = await getDocuments()
  if (!docs)
    return null

  if (docs.length === 0) {
    return (
      <p>No documents found</p>
    )
  }

  return (
    <div>
      <PageHeading />
      <div className="grid grid-cols-3 gap-5">
        {docs.map(doc => (
          <DocCard doc={doc} key={doc.id} />
        ))}
      </div>
    </div>
  )
}
