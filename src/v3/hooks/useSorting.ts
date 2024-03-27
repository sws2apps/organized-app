import { useState, useMemo } from 'react';
import { getComparator, stableSort } from '@components/table/helpers';
import { Order } from '@components/table/index.types';

interface UseSortingProps {
  initialOrder: Order;
  initialOrderBy: string;
  rows: { [key: string]: string | number }[];
}

const useSorting = ({ initialOrder, initialOrderBy, rows }: UseSortingProps) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);

  const handleRequestSort = (event: unknown, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = useMemo(() => stableSort(rows, getComparator(order, orderBy)), [order, orderBy, rows]);

  return { order, orderBy, handleRequestSort, visibleRows };
};

export default useSorting;
