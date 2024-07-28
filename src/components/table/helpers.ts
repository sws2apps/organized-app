import { Order } from './index.types';

/**
 * Compares two elements of type T in descending order based on the specified orderBy key.
 * @param a - The first element to compare.
 * @param b - The second element to compare.
 * @param orderBy - The key by which the elements are compared.
 * @returns A negative value if a should appear before b, a positive value if b should appear before a, or 0 if they are equal.
 */
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

/**
 * Returns a comparator function to compare elements of type T based on the specified order and orderBy key.
 * @param order - The order of sorting, either 'asc' (ascending) or 'desc' (descending).
 * @param orderBy - The key by which the elements are sorted.
 * @returns A comparator function to be used for sorting elements.
 */
export function getComparator<Key extends keyof number | string>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Sorts an array of elements of type T in a stable manner using the specified comparator function.
 * @param array - The array of elements to be sorted.
 * @param comparator - The comparator function used for sorting.
 * @returns A new array containing the sorted elements.
 */
export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
