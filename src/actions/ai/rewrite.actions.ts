'use server'
export async function rewriteWithAi(text: string) {
  try {
    if (!text) {
      return new Error('Text cannot be empty')
    }

    console.log('from text:', text)

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt: `
        Rewrite the following text to improve/correct it. Give three examples of improvements.
        Return a response, in a javascript array of strings. Don't add any titles to the examples (for example Improvement 1, Example 2 etc.)
                
        Here is the original text:
        ${text}
       
        `,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return JSON.parse(data.response)
  }
  catch {
    console.error('Error validating text')
  }
}
