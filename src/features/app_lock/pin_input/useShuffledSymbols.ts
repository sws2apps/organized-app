import { useState } from 'react';

const randomIndex = (max: number) => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
};

const pickSymbols = (length: number, poolSize: number) => {
  const pool = Array.from({ length: poolSize }, (_, i) => i);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, length);
};

// a fresh set of symbols for every new entry, stable while typing
const useShuffledSymbols = (
  length: number,
  value: string,
  poolSize: number
) => {
  const isEmpty = value.length === 0;

  const [order, setOrder] = useState(() => pickSymbols(length, poolSize));
  const [wasEmpty, setWasEmpty] = useState(isEmpty);

  if (isEmpty !== wasEmpty) {
    setWasEmpty(isEmpty);
    if (isEmpty) setOrder(pickSymbols(length, poolSize));
  }

  return order;
};

export default useShuffledSymbols;
