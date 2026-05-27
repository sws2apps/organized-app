import { useRef, useMemo } from 'react';

/**
 * Fisher-Yates shuffle (Durstenfeld variant).
 * Returns a new shuffled copy; never mutates the input.
 */
const shuffle = <T,>(array: readonly T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Returns a shuffled permutation of symbol indices [0 .. length-1].
 *
 * - Guarantees every cell gets a **unique** symbol (no repeats).
 * - Re-shuffles whenever the PIN value resets to empty (e.g. after a
 *   failed attempt or a new input session), giving each attempt a
 *   fresh, unpredictable symbol arrangement.
 * - Stays stable while the user is actively typing digits.
 */
const useShuffledSymbols = (length: number, value: string): number[] => {
  const prevEmptyRef = useRef(true);
  const orderRef = useRef<number[]>([]);

  return useMemo(() => {
    const isEmpty = value.length === 0;

    const lengthChanged = orderRef.current.length !== length;

    // Re-shuffle on first render, when the PIN resets to empty, or when
    // the requested cell count changes (defensive — length is currently
    // always 4, but the hook's API accepts it as a parameter).
    if (
      lengthChanged ||
      (isEmpty && (!orderRef.current.length || !prevEmptyRef.current))
    ) {
      const indices = Array.from({ length }, (_, i) => i);
      orderRef.current = shuffle(indices);
    }

    prevEmptyRef.current = isEmpty;
    return orderRef.current;
  }, [length, value]);
};

export default useShuffledSymbols;
