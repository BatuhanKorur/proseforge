import { useEffect } from 'react'
import { getWordData } from '@/actions/ai/word.actions'

export default function WordDetails({ word }: { word: string }) {
  const fetchWordData = async (word: string) => {
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
  }, [word])

  return (
    <div className="px-6 py-14">
      <p>{ word }</p>
    </div>
  )
}
