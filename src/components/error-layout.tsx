import type { ReactNode } from 'react'

export default function ErrorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center h-full text-primary/90 tracking-wide text-[15px]">
      { children }
    </div>
  )
}
