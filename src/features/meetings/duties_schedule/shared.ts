const COLUMN_SIZES: Record<number, number> = { 1: 12, 2: 6 };

// MUI grid columns for N person fields on a duty row (max three per row)
export const dutyFieldColumns = (count: number) => COLUMN_SIZES[count] ?? 4;
