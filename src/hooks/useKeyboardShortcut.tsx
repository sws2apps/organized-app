import { useEffect } from 'react';

type KeysCombination = string[];

const useKeyboardShortcut = (keys: KeysCombination, action: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = new Set(
        [
          event.ctrlKey ? 'Control' : '',
          event.altKey ? 'Alt' : '',
          event.shiftKey ? 'Shift' : '',
          event.metaKey ? 'Meta' : '',
          event.key,
        ].filter(Boolean)
      );

      if (keys.every((key) => pressedKeys.has(key))) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, action]);
};

export default useKeyboardShortcut;
