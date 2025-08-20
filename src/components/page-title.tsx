export default function PageTitle({ title }: {
  title: string
}) {
  return (
    <h1 className="text-3xl font-semibold mb-1 w-full">{ title }</h1>
  )
}
