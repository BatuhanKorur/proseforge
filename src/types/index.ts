export type OllamaStatus = 'checking' | 'running' | 'offline'

export interface FavoriteItem {
  title: string
  id: string
}

export interface LookupResponse {
  word: string
  definition: string
  synonyms: string[]
}
