import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

export const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: 'j',
    action: () => {},
    description: 'Next article',
  },
  {
    key: 'k',
    action: () => {},
    description: 'Previous article',
  },
  {
    key: 'o',
    action: () => {},
    description: 'Open article',
  },
  {
    key: 's',
    action: () => {},
    description: 'Star article',
  },
  {
    key: 'r',
    action: () => {},
    description: 'Refresh feeds',
  },
  {
    key: '?',
    shift: true,
    action: () => {},
    description: 'Show shortcuts',
  },
];
