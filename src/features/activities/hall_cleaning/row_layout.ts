export const CLEANING_NAME_WIDTH = 240;

// Prefer complete rows of three, then complete rows of two.
export const cleaningFieldColumns = (count: number) => {
  if (count === 1) return 12;
  if (count % 3 === 0) return 4;
  return count % 2 === 0 ? 6 : 4;
};
