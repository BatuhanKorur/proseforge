'use server'

import dictionaryEn from 'dictionary-en'
import { retext } from 'retext'
import retextEnglish from 'retext-english'
import retextReadability from 'retext-readability'
import retextSpell from 'retext-spell'

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

export interface AnalysisResult {
  spellcheck: SpellCheckResult[]
  spellcheckWords: string[]
  readability: ReadabilityResult[]
}

function groupBySource(messages: any[]) {
  return messages.reduce<Record<string, any[]>>((acc, message) => {
    const sourceKey = message.source ?? 'unknown'
    if (!acc[sourceKey])
      acc[sourceKey] = []
    acc[sourceKey].push(message)
    return acc
  }, {})
}

export async function analyze(text: string): Promise<AnalysisResult> {
  const check = await retext()
    .use(retextEnglish)
    .use(retextReadability)
    .use(retextSpell, { dictionary: dictionaryEn })
    .process(text)

  const grouped = groupBySource(check.messages)
  const { spellcheckItems, spellcheckWords } = extractSpellcheckResults(grouped['retext-spell'])
  const readabilityItems = extractReadabilityResults(grouped['retext-readability'])

  console.log(grouped)
  return {
    spellcheck: spellcheckItems,
    spellcheckWords,
    readability: readabilityItems,
  }
}

function extractReadabilityResults(messages: any[] = []): ReadabilityResult[] {
  return messages.reduce<ReadabilityResult[]>((acc, msg) => {
    const score = parseReadabilityScore(msg.reason)
    if (score) {
      acc.push({
        reason: msg.reason,
        sentence: msg.actual ?? '',
        score,
      })
    }
    return acc
  }, [])
}

function extractSpellcheckResults(messages: any[] = []): { spellcheckItems: SpellCheckResult[], spellcheckWords: string[] } {
  const spellcheckItems: SpellCheckResult[] = []
  const spellcheckWords = new Set<string>()

  for (const msg of messages) {
    // 'actual' contains the misspelled word from the text.
    const misspelledWord = msg.actual
    if (misspelledWord) {
      spellcheckWords.add(misspelledWord)
      spellcheckItems.push({
        word: misspelledWord,
        actual: misspelledWord,
        expected: msg.expected ?? [],
        message: msg.reason,
      })
    }
  }

  return {
    spellcheckItems,
    spellcheckWords: Array.from(spellcheckWords),
  }
}

function parseReadabilityScore(text: string | undefined | null): [number, number] | null {
  if (!text)
    return null
  const match = text.match(/(\d+)\s*(?:out of|of|\/)\s*(\d+)/i)
  if (!match)
    return null
  const a = Number(match[1])
  const b = Number(match[2])
  if (Number.isFinite(a) && Number.isFinite(b))
    return [a, b]
  return null
}
