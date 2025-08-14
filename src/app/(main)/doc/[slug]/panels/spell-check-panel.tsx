import { Icon } from '@iconify/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function SpellCheckPanel({ checks }: {
  checks: any[]
}) {
  return (
    <Accordion type="single" collapsible>
      {checks.map((check: any, index: number) => (
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
        { expected.map((expectedWord: string, index: number) => (
          <button
            type="button"
            key={index}
            className="px-3"
          >
            { expectedWord }
          </button>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}
