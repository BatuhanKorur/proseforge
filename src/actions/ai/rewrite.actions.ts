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
        Rewrite the following text by improving and correcting it.
        Give 3 examples of improvements.
        First example should be a general improvement.
        Second example should be shorter and more concise.
        Third example can be a little longer, while being specific and related to the original text.
        
        Return the rewritten text with the following format:
        [
          {
            "id": "general",
            "text": "..."
          },
          {
            "id": "shorter",
            "text": "..."
          },
          {
            "id": "specific",
            "text": "..."
          }
        ]

                
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
    const r = JSON.parse(data.response)
    return r
  }
  catch (error) {
    console.error('Error validating text', error)
  }
}
