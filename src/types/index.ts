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

export enum DocInspectorType {
  ASSIST,
  ANALYSIS,
}

export enum DocPanelType {
  SPELLCHECK,
  READABILITY,
}
