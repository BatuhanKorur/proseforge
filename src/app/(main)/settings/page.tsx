'use client'
import { useEffect, useState } from 'react'
import { getOllamaModels } from '@/actions/lama.actions'
import GeneralSettings from '@/app/(main)/settings/general-settings'
import { IgnoredWordsTable } from '@/app/(main)/settings/ignored-words-table'
import UserProfileSettings from '@/app/(main)/settings/user-profile-settings'
import PageTitle from '@/components/page-title'
import { cn } from '@/lib/utils'

enum SettingsView {
  GENERAL = 'General',
  USER_PROFILE = 'User Profile',
  IGNORED_WORDS = 'Ignored Words',
}

export default function SettingsPage() {
  const [activeView, setActiveView] = useState<SettingsView>(SettingsView.GENERAL)
  const [ollamaModels, setOllamaModels] = useState<any>(null)
  useEffect(() => {
    const loadOllamaModels = async () => {
      try {
        const models = await getOllamaModels()
        setOllamaModels(models)
      }
      catch (error) {
        console.error('Failed to load Ollama models:', error)
      }
    }

    loadOllamaModels()
  }, [])

  const tabs = Object.entries(SettingsView).map(([key, value]) => ({ key, value }))
  return (
    <div className="p-4 h-full flex flex-col">
      <PageTitle title="Settings" />
      <div className="flex mt-5 h-full">
        <div className="w-1/6 flex flex-col space-y-2 border-r">
          { tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={cn('inline-flex items-center p-2 text-sm', activeView === tab.value ? 'text-primary font-medium' : 'cursor-pointer text-muted-foreground transition duration-200 ease-in-out hover:text-primary')}
              onClick={() => setActiveView(tab.value)}
            >
              { tab.value }
            </button>
          ))}
        </div>
        <div className="w-5/6 pl-8">
          { activeView === SettingsView.GENERAL && <GeneralSettings models={ollamaModels} />}
          { activeView === SettingsView.USER_PROFILE && <UserProfileSettings />}
          { activeView === SettingsView.IGNORED_WORDS && <IgnoredWordsTable /> }
        </div>
      </div>
    </div>
  )
}
