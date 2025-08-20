'use server'

export async function pingOllama(baseUrl = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434'): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1500)

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    })
    return res.ok
  }
  catch {
    return false
  }
  finally {
    clearTimeout(timeout)
  }
}

export async function getOllamaModels(baseUrl = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434') {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    return data
  }
  catch (error) {
    console.error('Failed to fetch Ollama models:', error)
    throw error
  }
  finally {
    clearTimeout(timeout)
  }
}
