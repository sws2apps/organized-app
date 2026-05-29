import { useRef, useMemo } from 'react';

const getSecureRandom = () => {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] / (0xffffffff + 1);
};

const shuffle = <T,>(array: readonly T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Assigns distinct random symbols from the pool to the PIN boxes.
// Reshuffles when the field is cleared or config changes.
const useShuffledSymbols = (
  length: number,
  value: string,
  poolSize: number
): number[] => {
  const prevEmptyRef = useRef(true);
  const orderRef = useRef<number[]>([]);
  const poolSizeRef = useRef(poolSize);

  return useMemo(() => {
    const isEmpty = value.length === 0;

    const configChanged =
      orderRef.current.length !== length || poolSizeRef.current !== poolSize;

    if (
      configChanged ||
      (isEmpty && (!orderRef.current.length || !prevEmptyRef.current))
    ) {
      const pool = Array.from({ length: poolSize }, (_, i) => i);
      orderRef.current = shuffle(pool).slice(0, length);
      poolSizeRef.current = poolSize;
    }

    prevEmptyRef.current = isEmpty;
    return orderRef.current;
  }, [length, value, poolSize]);
};

export default useShuffledSymbols;
