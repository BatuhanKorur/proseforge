import { useEffect } from 'react'

interface UseShortcutOptions {
  preventDefault?: boolean
}

export function useShortcut(combo: string, callback: () => void, options: UseShortcutOptions = {
  preventDefault: true,
}): void {
  const [mod, key] = combo.split('+')
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const hasCtrl = mod === 'ctrl' && (e.metaKey || e.ctrlKey)
      if (hasCtrl && e.key.toLowerCase() === key) {
        if (options.preventDefault) {
          e.preventDefault()
        }
        callback()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [callback, combo, key, mod, options])
}
