import { styled } from '@mui/system';
import { Table, TableCell, TableProps, TableRow } from '@mui/material';
import { TableRowProps } from '@mui/material/TableRow/TableRow';
import { TableCellProps } from '@mui/material/TableCell/TableCell';

export const StyledRow = styled((props: TableRowProps) => <TableRow hover tabIndex={-1} {...props} />)(() => ({
  '&.MuiTableRow-hover:hover': {
    backgroundColor: 'var(--accent-150)',
    cursor: 'pointer',

    td: { color: 'var(--accent-dark)' },
  },
}));

export const StyledTable = styled((props: TableProps) => <Table stickyHeader size={'small'} {...props} />)(() => ({}));

export const StyledCell = styled((props: TableCellProps) => <TableCell className={'body-small-regular'} {...props} />)(
  () => ({
    borderColor: 'var(--accent-200)',
    color: 'var(--black)',
  })
);
