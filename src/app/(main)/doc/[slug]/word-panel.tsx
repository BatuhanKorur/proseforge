export default function WordPanel({ word }: { word: string }) {
/*  const fetchWordData = async (word: string) => {
    try {
      const result = await getWordData(word)
      console.log(result)
    }
    catch (e) {
      console.error('Error fetching word data:', e)
    }
  }

  useEffect(() => {
    if (word) {
      fetchWordData(word)
    }
  }, [word]) */

  return (
    <div className="px-3 pt-6">
      <p>{ word }</p>
    </div>
  )
}
