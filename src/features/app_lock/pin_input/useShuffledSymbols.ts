import { useRef, useMemo } from 'react';

const shuffle = <T,>(array: readonly T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const useShuffledSymbols = (length: number, value: string): number[] => {
  const prevEmptyRef = useRef(true);
  const orderRef = useRef<number[]>([]);

  return useMemo(() => {
    const isEmpty = value.length === 0;

    const lengthChanged = orderRef.current.length !== length;
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
