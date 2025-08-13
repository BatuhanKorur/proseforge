'use client'
import { useState } from 'react'

export default function WordPanel({ word }: { word: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [definition, setDefinition] = useState('')
  const [synonyms, setSynonyms] = useState([])
  /*  const handleChange = async (word: string) => {
    setIsLoading(true)
    try {
      const resp = await getWordData(word)
      setDefinition(resp.definition)
      setSynonyms(resp.synonyms)
    }
    catch (e) {
      console.error('Error fetching word data:', e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const clearPanel = () => {
    setDefinition('')
    setSynonyms([])
  }

  useEffect(() => {
    if (word.trim() === '') {
      clearPanel()
    }
    handleChange(word)
    console.log('Word Changed: ', word)
  }, [word]) */
  return (
    <div className="px-3 pt-6">
      <div>
        <p>{ word }</p>
      </div>
      { isLoading && <p>Loading...</p>}
      { definition && (
        <div>
          <p>{ definition }</p>
        </div>
      )}
      { synonyms.length > 0 && (
        <div>
          <p>Synonyms:</p>
          <ul>
            { synonyms.map(synonym => (
              <li key={synonym}>{ synonym }</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
