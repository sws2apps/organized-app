import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { MouseEvent, useMemo, useState } from 'react';
import { visuallyHidden } from '@mui/utils';
import { IconArrowDown } from '@icons/index';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: '№', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'covered', label: 'Covered', minWidth: 100 },
  {
    id: 'households',
    label: 'Households',
    minWidth: 170,
  },
];

const rows = [
  { id: 'M2', name: 'Marktstraße, Gartenstraße', covered: '23.12.2020', households: 163 },
  { id: 'M5', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M4', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M1', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M6', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M7', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M8', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
];

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
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

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            style={{ backgroundColor: 'transparent', borderColor: 'var(--accent-200)' }}
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={(props) => (
                <Box {...props}>
                  <IconArrowDown color={'var(--grey-350)'} />
                </Box>
              )}
            >
              <Typography className={'body-small-regular'} color={'var(--grey-350)'}>
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const CPETable = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('id');

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = useMemo(() => stableSort(rows, getComparator(order, orderBy)), [order, orderBy]);

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table" size={'small'}>
        {/*<TableHead>*/}
        {/*  <TableRow>*/}
        {/*    {columns.map((column) => (*/}
        {/*      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>*/}
        {/*        {column.label}*/}
        {/*      </TableCell>*/}
        {/*    ))}*/}
        {/*  </TableRow>*/}
        {/*</TableHead>*/}
        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      className={'body-small-semibold'}
                      style={{ borderColor: 'var(--accent-200)', color: 'var(--black)' }}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CPETable;
