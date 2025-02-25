"use client"

import { useState, useEffect, useCallback } from "react"

type ShortcutAction = () => void

export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutAction>>({})
  const [stopAction, setStopAction] = useState<ShortcutAction | null>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (event.code === "Space") {
        event.preventDefault()
        if (stopAction) {
          stopAction()
        }
        return
      }

      const action = shortcuts[event.key]
      if (action) {
        event.preventDefault()
        action()
      }
    },
    [shortcuts, stopAction],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const assignShortcut = useCallback(
    (key: string, action: ShortcutAction) => {
      if (key === "Space") return

      setShortcuts(prev => {
        const updated = { ...prev }
        // Supprimer toute assignation existante pour cette action
        Object.keys(updated).forEach(k => {
          if (updated[k] === action) {
            delete updated[k]
          }
        })
        // Supprimer toute assignation existante pour cette touche
        if (updated[key]) {
          delete updated[key]
        }
        return { ...updated, [key]: action }
      })
    },
    [],
  )

  const clearShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }, [])

  const setStopActionHandler = useCallback((action: ShortcutAction) => {
    setStopAction(() => action)
  }, [])

  return { assignShortcut, clearShortcut, shortcuts, setStopActionHandler }
}