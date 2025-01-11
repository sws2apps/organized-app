import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage keydown event handlers for specific key combinations.
 * Allows registering multiple handlers for different key combinations.
 *
 * Usage:
 * ```
 * const registerKeydownHandler = useKeydownHandler();
 * registerKeydownHandler('Enter', loginFunc);
 * registerKeydownHandler('Ctrl+A', openArticleFunc);
 * ```
 */
const useKeydownHandler = () => {
  const keyHandlers = useRef({});

  useEffect(() => {
    const handleKeydown = (event) => {
      const keyCombo = getKeyCombo(event);
      if (keyHandlers.current[keyCombo]) {
        keyHandlers.current[keyCombo](event);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const registerKeydownHandler = (keyCombo: string, handler: () => void) => {
    keyHandlers.current[keyCombo] = handler;
  };

  const getKeyCombo = (event) => {
    const keys = [];
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    keys.push(event.key);
    return keys.join('+');
  };

  return { registerKeydownHandler };
};

export default useKeydownHandler;
