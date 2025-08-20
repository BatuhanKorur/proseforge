export type OllamaStatus = 'checking' | 'running' | 'offline'

export interface FavoriteItem {
  title: string
  id: string
}

export interface LookupResponse {
  word: string
  definition: string
  synonyms: {
    word: string
    definition: string
  }[]
}

export interface RewriteSuggestion {
  id: string
  text: string
}

export interface SpellCheckResult {
  word: string
  expected: string[]
  message: string
  actual: string
}

export interface ReadabilityResult {
  reason: string
  sentence: string
  score: [number, number]
}

export interface ReviewResult {
  spellcheck: SpellCheckResult[]
  spellcheckWords: string[]
  readability: ReadabilityResult[]
}

export enum DocInspectorType {
  ASSIST,
  ANALYSIS,
}

export enum DocPanelType {
  SPELLCHECK,
  READABILITY,
}
