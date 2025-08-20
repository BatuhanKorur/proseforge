import type { SpellCheckResult } from '@/types'
import { Icon } from '@iconify/react'
import { useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useUserStore } from '@/stores/user.store'

export default function SpellCheckPanel({ messages }: {
  messages: SpellCheckResult[]
}) {
  console.log('My Message:', messages)
  const { ignoredWords } = useUserStore()

  const ignoredSet = useMemo(
    () => new Set((ignoredWords ?? []).map(w => w.trim().toLowerCase())),
    [ignoredWords],
  )

  const filteredMessages = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0)
      return []
    return messages.filter((m) => {
      const normalized = (m.word ?? '').trim().toLowerCase()
      return normalized && !ignoredSet.has(normalized)
    })
  }, [messages, ignoredSet])

  return (
    <Accordion type="single" collapsible>
      <div>{ JSON.stringify(ignoredWords)}</div>
      {filteredMessages
        .map((check: any, index: number) => (
          <SpellCheckCard
            key={index}
            val={index}
            word={check.word}
            expected={check.expected}
          />
        ))}
    </Accordion>
  )
}

function SpellCheckCard({ val, word, expected }: {
  val: number
  word: string
  expected: string[]
}) {
  const { ignoreWord } = useUserStore()
  return (
    <AccordionItem value={String(val)} className="border-b px-4">
      <AccordionTrigger>
        <div className="flex items-center">
          <div className="shrink-0 pr-2">
            <Icon icon="lucide:spell-check-2" className="size-5 text-red-200" />
          </div>
          <div>
            <p className="text-[15px] text-red-400">{ word }</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div>
          { expected.map((expectedWord: string, index: number) => (
            <button
              type="button"
              key={index}
              className="px-3"
            >
              { expectedWord }
            </button>
          ))}
        </div>
        <div>
          <button type="button" onClick={() => ignoreWord(word)}>Ignore</button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
