import { SxProps } from '@mui/material';
import { MouseEvent } from 'react';

/**
 * Represents the order of sorting, either 'asc' (ascending) or 'desc' (descending).
 */
export type Order = 'asc' | 'desc';

/**
 * Represents a column configuration for the enhanced table.
 */
export interface Column {
  /**
   * The unique identifier of the column.
   */
  id: string;

  /**
   * The label displayed for the column.
   */
  label: string;

  /**
   * The type of the column data, either 'number' or 'action'.
   */
  type?: 'number' | 'action';

  /**
   * A function to format the value of the column.
   * @param value - The value to be formatted.
   * @returns The formatted string representation of the value.
   */
  format?: (value: number) => string;

  /**
   * Custom styling for the column.
   */
  sx?: SxProps;
}

/**
 * Props for the EnhancedTable component.
 */
export interface EnhancedTableProps {
  /**
   * Callback function triggered when requesting a sort operation on a column.
   * @param event - The click event triggering the sort operation.
   * @param property - The property (column ID) by which the table is sorted.
   */
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;

  /**
   * The current order of sorting.
   */
  order: Order;

  /**
   * The property (column ID) by which the table is sorted.
   */
  orderBy: string;

  /**
   * An array of column configurations for the table.
   */
  columns: Column[];
}
