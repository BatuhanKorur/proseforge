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
  )
}
