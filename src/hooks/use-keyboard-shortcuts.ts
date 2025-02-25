"use client"

import { useState, useEffect, useCallback } from "react"

type ShortcutAction = () => void

export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutAction>>({})
  const [stopAction, setStopAction] = useState<ShortcutAction | null>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const activeElement = document.activeElement
      // Ne pas intercepter les entrées dans les champs de texte
      if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
        return
      }

      // Si la touche est 'Space', on gère l'arrêt si une action d'arrêt existe
      if (event.code === "Space") {
        event.preventDefault()
        if (stopAction) {
          stopAction()
        }
        return
      }

      // Vérification des autres raccourcis
      const action = shortcuts[event.key]
      if (action) {
        event.preventDefault()
        action()
      }
    },
    [shortcuts, stopAction],
  )

  // Utilisation de useEffect pour gérer l'événement global de keydown
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Assigner un nouveau raccourci
  const assignShortcut = useCallback(
    (key: string, action: ShortcutAction) => {
      if (key === "Space") return

      setShortcuts(prev => {
        const updated = { ...prev }

        // On retire l'action existante si elle était assignée à une autre touche
        for (const existingKey in updated) {
          if (updated[existingKey] === action) {
            delete updated[existingKey]
            break
          }
        }

        // On retire l'assignation de la touche si elle existe déjà
        if (updated[key]) {
          delete updated[key]
        }

        updated[key] = action
        return updated
      })
    },
    [],
  )

  // Supprimer un raccourci
  const clearShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }, [])

  // Configurer l'action d'arrêt
  const setStopActionHandler = useCallback((action: ShortcutAction) => {
    setStopAction(() => action)
  }, [])

  return { assignShortcut, clearShortcut, shortcuts, setStopActionHandler }
}
