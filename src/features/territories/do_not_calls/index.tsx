import { useAtomValue } from 'jotai';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Badge, InfoNote, Typography } from '@components/index';
import TableHead from '@components/table/TableHead';
import Card from '@components/card';
import { territoriesState } from '@states/territories';
import useTableSort from '../useTableSort';
import TruncatedText from '../components/truncated_text';
import { Territory } from '@definition/territory';

type Row = {
  territory: Territory;
  entry: Territory['doNotCalls'][number];
};

// dates are stored as dd.mm.yyyy, which does not sort as text
const sortableDate = (value: string) => value.split('.').reverse().join('');

const rowStates = {
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: 'var(--accent-100)' },
  '&:active': { backgroundColor: 'var(--accent-200)' },
};

const sortValue = (row: Row, key: string) => {
  switch (key) {
    case 'territory':
      return row.territory.number;
    case 'name':
      return row.entry.name ?? '';
    case 'added':
      return row.entry.addedBy;
    case 'review':
      return row.entry.reviewNeeded ? 1 : 0;
    case 'date':
      return sortableDate(row.entry.date);
    default:
      return row.entry.address;
  }
};

const DoNotCalls = () => {
  const territories = useAtomValue(territoriesState);

  const { order, orderBy, handleRequestSort } = useTableSort('date', ['date']);

  const rows: Row[] = territories
    .flatMap((territory) =>
      territory.doNotCalls.map((entry) => ({ territory, entry }))
    )
    .sort((a, b) => {
      const left = sortValue(a, orderBy);
      const right = sortValue(b, orderBy);

      const compared =
        typeof left === 'string' && typeof right === 'string'
          ? left.localeCompare(right)
          : Number(left) - Number(right);

      return order === 'asc' ? compared : -compared;
    });

  if (rows.length === 0) {
    return <InfoNote message="No do not call addresses recorded yet." />;
  }

  const columns = [
    { id: 'territory', label: 'No.', sx: { width: '76px' } },
    { id: 'address', label: 'Address', sx: { minWidth: '200px' } },
    { id: 'name', label: 'Name', sx: { minWidth: '180px' } },
    { id: 'date', label: 'Date', sx: { width: '110px' } },
    { id: 'added', label: 'Added by', sx: { width: '150px' } },
    { id: 'review', label: 'Review', sx: { width: '120px' } },
  ];

  return (
    <Card>
      <TableContainer
        sx={{
          overflowX: 'auto',
          // fill the page down to the bottom edge, with room for the mobile bar
          maxHeight: {
            mobile: 'calc(100dvh - 190px)',
            tablet688: 'calc(100dvh - 130px)',
          },
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            minWidth: '840px',
            '& .MuiTableCell-root': {
              padding: '10px 8px',
              borderColor: 'var(--accent-200)',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              backgroundColor: 'var(--white)',
              position: 'sticky',
              // a hair above the container hides the row edge that would
              // otherwise show through while scrolling
              top: '-1px',
              zIndex: 2,
              borderBottom: 'none',
              boxShadow: 'inset 0 -1px 0 var(--accent-200)',
            },
            '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root':
              {
                borderBottom: 'none',
              },
          }}
        >
          <TableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={columns}
          />

          <TableBody>
            {rows.map(({ territory, entry }) => (
              <TableRow key={entry.id} sx={rowStates}>
                <TableCell>
                  <Typography
                    className="body-small-semibold"
                    color="var(--black)"
                  >
                    {territory.number}
                  </Typography>
                </TableCell>

                <TableCell>
                  <TruncatedText
                    className="body-regular"
                    color="var(--black)"
                    text={entry.address}
                  />
                </TableCell>

                <TableCell>
                  <TruncatedText
                    className="body-small-regular"
                    color="var(--grey-400)"
                    text={entry.name ?? '–'}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    className="body-small-regular"
                    color="var(--grey-400)"
                    noWrap
                  >
                    {entry.date}
                  </Typography>
                </TableCell>

                <TableCell>
                  <TruncatedText
                    className="body-small-regular"
                    color="var(--grey-400)"
                    text={entry.addedBy}
                  />
                </TableCell>

                <TableCell>
                  {entry.reviewNeeded && (
                    <Box sx={{ width: 'fit-content' }}>
                      <Badge
                        size="small"
                        filled={false}
                        color="orange"
                        text="Review needed"
                      />
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default DoNotCalls;
