'use client'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import PageTitle from '@/components/page-title'

function SettingButton({ label, ...props }: ComponentProps<'button'> & {
  label: string
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center p-2 text-sm font-medium"
      {...props}
    >
      { label }
    </button>
  )
}
export default function SettingsPage() {
  const [activeView, setActiveView] = useState('general')
  return (
    <div className="p-4 h-full flex flex-col">
      <PageTitle title="Settings" />
      <div className="flex mt-5 h-full">
        <div className="w-1/6 flex flex-col space-y-2 border-r">
          <SettingButton label="General" onClick={() => setActiveView('general')} />
          <SettingButton label="Ignored Words" onClick={() => setActiveView('ignored')} />
        </div>
        <div className="w-5/6 pl-8">
          <p>
            { activeView }
          </p>
          <p>Right</p>
        </div>
      </div>
    </div>
  )
}
