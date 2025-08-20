'use server'
export async function lookupWord(word: string) {
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
        For the word "${word}", provide the definition and synonyms. 
        Definition should be a simple, short phrase that describes the meaning of the word.
        
        Synonyms must be between 2 to 5. Synonyms must be related to the word in some way.
        
        Return a response, in the following format:
        {
          word: "${word}",
          definition: "Meaning of the word",
          synonyms: [
          {
          word: "synonym1",
          definition: "Definition of synonym1",
          },
          {
          word: "synonym2",
          definition: "Definition of synonym2",
          },
          ]
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
