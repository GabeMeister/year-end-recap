import { useEffect } from "react";
import { isSuperset } from "@/src/utils/general";

export type ShortcutEvent = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean; // command key
};

export type ShortcutType = {
  event: ShortcutEvent;
  callback: (() => void) | ((event: Event) => void);
};

export default function useKeyboardShortcuts(shortcuts: ShortcutType[]) {
  useEffect(() => {
    const handleKeyDown = (triggeredEvent) => {
      shortcuts.forEach(({ event, callback }) => {
        if (
          isSuperset(triggeredEvent, {
            ...event,
            ctrlKey: !!event.ctrlKey,
            altKey: !!event.altKey,
            shiftKey: !!event.shiftKey,
            metaKey: !!event.metaKey,
          })
        ) {
          callback(triggeredEvent);
          return;
        }
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
