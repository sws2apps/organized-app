import {
  Table as MUITable,
  TableHead as MUITableHead,
  TableBody as MUITableBody,
  styled,
} from '@mui/material';

export const Table = styled(MUITable)({
  '& .MuiTableCell-root': {
    padding: '8px',
    boxSizing: 'content-box',
  },
  '& .MuiTableHead-root .MuiTableCell-root:first-of-type': {
    zIndex: 5,
  },
  '& .MuiTableHead-root .MuiTableCell-root:nth-of-type(2)': {
    zIndex: 5,
  },
  '& .MuiTableCell-root:first-of-type': {
    width: '30px',
    backgroundColor: 'var(--white)',
    alignContent: 'stretch',
  },
  '& .MuiTableCell-root:nth-of-type(2)': {
    minWidth: '120px',
    backgroundColor: 'var(--white)',
    alignContent: 'stretch',
  },
  '& .MuiTableCell-root:nth-of-type(3)': {
    minWidth: '160px',
    backgroundColor: 'var(--white)',
    alignContent: 'stretch',
  },
}) as unknown as typeof MUITable;

export const TableHead = styled(MUITableHead)({
  '& .MuiTableCell-root': {
    padding: '8px',
    boxSizing: 'content-box',
  },
  '& .MuiTableHead-root .MuiTableCell-root:first-of-type': {
    zIndex: 5,
  },
  '& .MuiTableHead-root .MuiTableCell-root:nth-of-type(2)': {
    zIndex: 5,
  },
  '& .MuiTableCell-root:first-of-type': {
    width: '30px',
    backgroundColor: 'var(--white)',
  },
  '& .MuiTableCell-root:nth-of-type(2)': {
    minWidth: '120px',
    backgroundColor: 'var(--white)',
  },
}) as unknown as typeof MUITableHead;

export const TableBody = styled(MUITableBody)({
  '& .MuiTableRow-root > .MuiTableCell-root': {
    borderBottom: '1px solid var(--accent-200)',
  },
  '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
    borderBottom: 'none',
  },
}) as unknown as typeof MUITableBody;
