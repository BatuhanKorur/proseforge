export async function getWordData(word: string) {
  try {
    if (!word) {
      throw new Error('Word cannot be empty')
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt: `
        For the word "${word}", provide the meaning and synonyms. 
        Try to give at least 3 synonyms, and max 7.
        Definition should be a simple, short phrase that describes the meaning of the word.
        Return a response, in the following format:
        
        {
          definition: "Meaning of the word",
          synonyms: ["synonym1", "synonym2",...]
        }
        
        `,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const r = JSON.parse(data.response)
    return r
  }
  catch (e) {
    console.error('Error validating word:', e)
  }
}
