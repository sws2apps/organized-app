import { MouseEvent } from 'react';

export type Order = 'asc' | 'desc';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  type?: 'number' | 'action';
  format?: (value: number) => string;
}

export interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  columns: Column[];
}
