import { MouseEvent, useState } from 'react';
import { Order } from '@components/table/index.types';

const useTableSort = (
  defaultKey: string,
  descendingFirst: string[] = [],
  defaultOrder: Order = 'asc'
) => {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultKey);

  const handleRequestSort = (_event: MouseEvent<unknown>, property: string) => {
    if (property === 'action' || property === 'select') return;

    if (orderBy !== property) {
      setOrderBy(property);
      setOrder(descendingFirst.includes(property) ? 'desc' : 'asc');
      return;
    }

    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  return { order, orderBy, handleRequestSort };
};

export default useTableSort;
