import type { ReadabilityResult } from '@/types'
import { Icon } from '@iconify/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function ReadabilityPanel({ messages }: { messages: ReadabilityResult[] }) {
  return (
    <Accordion type="single" collapsible>
      { messages && messages.map((message, index) => (
        <ReadabilityCard
          key={index}
          message={message}
          keyValue={`item-${index}`}
        />
      ))}
    </Accordion>
  )
}

function ReadabilityCard({ keyValue, message }: {
  keyValue: string
  message: ReadabilityResult
}) {
  return (
    <AccordionItem value={keyValue} className="border-b px-4">
      <AccordionTrigger className="cursor-pointer">
        <div className="flex items-center w-full">
          <div className="shrink-0 pr-2">
            <Icon icon="prime:lightbulb" className="size-5 text-yellow-100" />
          </div>
          <div className="flex-1 flex justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Sentence can be improved</p>
              <p className="line-clamp-1 text-[14px]">{ message.sentence }</p>
            </div>
            <div className="text-xs text-muted-foreground">
              <span>{ message.score[0]}</span>
              <span> out of </span>
              <span>{ message.score[1] }</span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p>{ message.sentence }</p>
      </AccordionContent>
    </AccordionItem>
  )
}
