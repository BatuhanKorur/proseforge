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
