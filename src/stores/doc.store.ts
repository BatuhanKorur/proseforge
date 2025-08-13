import { create } from 'zustand'

interface DocStoreState {
  saveSignal: boolean
  setSaveSignal: (b: boolean) => void

  showSavedPulse: boolean
  pingSavedPulse: () => void
}

export const useDocStore = create<DocStoreState>(() => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return {
    saveSignal: false,
    setSaveSignal: (val) => {
      useDocStore.setState({ saveSignal: val })
    },
    showSavedPulse: false,
    pingSavedPulse: () => {
      if (timeoutId)
        clearTimeout(timeoutId)

      useDocStore.setState({ showSavedPulse: true })
      timeoutId = setTimeout(() => {
        useDocStore.setState({ showSavedPulse: false })
      }, 2500)
    },
  }
})
