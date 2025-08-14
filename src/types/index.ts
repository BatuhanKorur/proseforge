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

export interface AnalysisResponse {
  spellcheck: { word: string, expected: string }[]
}

export enum DocPanelType {
  SPELLCHECK,
  READABILITY,
}

export enum DocMainPanelType {
  ASSIST,
  ANALYSIS,
}
