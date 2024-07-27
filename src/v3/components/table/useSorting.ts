import { useState, useMemo } from 'react';
import { getComparator, stableSort } from '@components/table/helpers';
import { Order } from '@components/table/index.types';

/**
 * Props for the useSorting hook.
 */
export interface UseSortingProps {
  /**
   * The initial sorting order.
   */
  initialOrder: Order;

  /**
   * The initial column to sort by.
   */
  initialOrderBy: string;

  /**
   * The data rows to be sorted.
   */
  rows: { [key: string]: string | number }[];
}

/**
 * Hook for managing table sorting.
 * @param initialOrder - The initial sorting order.
 * @param initialOrderBy - The initial column to sort by.
 * @param rows - The data rows to be sorted.
 * @returns An object containing the current order, orderBy, handleRequestSort function, and sorted visible rows.
 */
const useSorting = ({
  initialOrder,
  initialOrderBy,
  rows,
}: UseSortingProps) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);

  /**
   * Handles sorting when a table column header is clicked.
   * @param _event - The click event.
   * @param property - The property to sort by.
   */
  const handleRequestSort = (_event: unknown, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = useMemo(
    () => stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows]
  );

  return { order, orderBy, handleRequestSort, visibleRows };
};

export default useSorting;
