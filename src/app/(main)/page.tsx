import { getDocuments } from '@/actions/doc.actions'
import DocBrowser from '@/components/doc-browser'
import ErrorLayout from '@/components/error-layout'

export default async function MainPage() {
  const docs = await getDocuments()
  if (!docs) {
    return (
      <ErrorLayout>Problem occurred while fetching documents</ErrorLayout>
    )
  }

  return (
    <DocBrowser docs={docs} />
  /*    <div>
      <div className="flex items-center justify-between mt-8 mb-4">
        <h1 className="text-4xl font-semibold">Documents</h1>
        <div className="flex">
          <SearchDocuments />
          <CreateDocument />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {docs.map(doc => (
          <DocCard doc={doc} key={doc.id} />
        ))}
      </div>
    </div> */
  )
}
