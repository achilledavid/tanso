import * as React from "react"
import * as ContextMenu from "@radix-ui/react-context-menu"
import { cn } from "@/lib/utils"

interface ShortcutContextMenuProps {
  children: React.ReactNode
  onAssignShortcut: (key: string) => void
  currentShortcut?: string
}

export function ShortcutContextMenu({ children, onAssignShortcut, currentShortcut }: ShortcutContextMenuProps) {
  const [listeningForKey, setListeningForKey] = React.useState(false)

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (listeningForKey) {
        event.preventDefault()
        const key = event.key === " " || event.code === "Space" ? "Space" : event.key
        onAssignShortcut(key)
        setListeningForKey(false)
      }
    },
    [listeningForKey, onAssignShortcut],
  )

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const handleContextMenuOpen = React.useCallback(() => {
    setListeningForKey(true)
  }, [])

  return (
    <ContextMenu.Root onOpenChange={(open) => open && handleContextMenuOpen()}>
      <ContextMenu.Trigger className="w-full">{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className={cn("min-w-[200px] bg-background rounded-md shadow-md p-2", "border border-border")}
        >
          <ContextMenu.Item className={cn("px-2 py-1 text-sm", "text-accent-foreground")}>
            {listeningForKey
              ? "Appuyez sur une touche..."
              : currentShortcut
              ? `Raccourci actuel: ${currentShortcut}`
              : "Assigner un raccourci"}
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}