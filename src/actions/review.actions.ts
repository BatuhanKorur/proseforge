'use server'

import dictionaryEn from 'dictionary-en'
import { retext } from 'retext'
import retextEnglish from 'retext-english'
import retextReadability from 'retext-readability'
import retextSpell from 'retext-spell'

function groupBySource(messages: any[]) {
  return messages.reduce<Record<string, any[]>>((acc, message) => {
    const sourceKey = message.source ?? 'unknown'
    if (!acc[sourceKey])
      acc[sourceKey] = []
    acc[sourceKey].push(message)
    return acc
  }, {})
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

export interface AnalysisResult {
  spellcheck: SpellCheckResult[]
  spellcheckWords: string[]
  readability: ReadabilityResult[]
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

function extractReadabilityResults(messages: any[]) {
  return messages.map((msg) => {
    const reason = msg.reason ?? ''
    return {
      sentence: msg.actual ?? '',
      reason,
      score: parseReadabilityScore(msg.reason),
    }
  })
}
function extractSpellcheckResults(messages: any[]) {
  const wordsList = new Set<string>()
  const spellcheckItems = messages.map((msg) => {
    const word = msg.ruleId ?? msg.message ?? ''
    if (word) {
      wordsList.add(word)
    }
    return {
      word,
      expected: msg.expected,
      message: msg.message,
      actual: msg.actual,
    }
  })
  return {
    spellcheckItems,
    spellcheckWords: Array.from(wordsList),
  }
}

function parseReadabilityScore(text: string | undefined | null): [number, number] | null {
  if (!text)
    return null
  // matches "5 out of 7", "5 of 7", "5/7", "5 out of 7 algorithms", etc.
  const m = text.match(/(\d+)\s*(?:out of|of|\/)\s*(\d+)/i)
  if (!m)
    return null
  const a = Number(m[1])
  const b = Number(m[2])
  if (Number.isFinite(a) && Number.isFinite(b))
    return [a, b]
  return null
}
