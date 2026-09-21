import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { InfoNote, Typography } from '@components/index';
import TableHead from '@components/table/TableHead';
import useTableSort from '../useTableSort';
import TruncatedText from './truncated_text';
import { Territory } from '@definition/territory';

const AssignmentHistory = ({
  territories,
  limit = 40,
  selectedId,
  onSelect,
}: {
  territories: Territory[];
  limit?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) => {
  const { order, orderBy, handleRequestSort } = useTableSort(
    'assigned',
    ['assigned', 'returned'],
    'desc'
  );

  const rowStates = {
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: 'var(--accent-100)' },
    '&:active': { backgroundColor: 'var(--accent-200)' },
  };

  const sortValue = ({
    territory,
    assignment,
  }: {
    territory: Territory;
    assignment: Territory['assignments'][number];
  }) => {
    switch (orderBy) {
      case 'number':
        return territory.number;
      case 'name':
        return territory.name;
      case 'publisher':
        return assignment.publisher;
      case 'returned':
        return assignment.endMonth;
      default:
        return assignment.startMonth;
    }
  };

  const rows = territories
    .flatMap((territory) =>
      territory.assignments.map((assignment) => ({ territory, assignment }))
    )
    .sort((a, b) => {
      const left = sortValue(a);
      const right = sortValue(b);

      const compared =
        typeof left === 'string' && typeof right === 'string'
          ? left.localeCompare(right)
          : Number(left) - Number(right);

      return order === 'asc' ? compared : -compared;
    })
    .slice(0, limit);

  if (rows.length === 0) {
    return <InfoNote message="No assignments recorded yet." />;
  }

  const columns = [
    { id: 'number', label: 'No.', sx: { width: '76px' } },
    { id: 'name', label: 'Territory', sx: { minWidth: '180px' } },
    { id: 'publisher', label: 'Publisher', sx: { minWidth: '160px' } },
    { id: 'assigned', label: 'Assigned', sx: { width: '120px' } },
    { id: 'returned', label: 'Returned', sx: { width: '120px' } },
  ];

  return (
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
          minWidth: '660px',
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
          {rows.map(({ territory, assignment }) => (
            <TableRow
              key={assignment.id}
              onClick={() => onSelect?.(territory.id)}
              sx={{
                ...rowStates,
                cursor: onSelect ? 'pointer' : 'default',
                backgroundColor:
                  selectedId === territory.id
                    ? 'var(--accent-150)'
                    : 'transparent',
              }}
            >
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
                  text={territory.name}
                />
              </TableCell>

              <TableCell>
                <TruncatedText
                  className="body-regular"
                  color="var(--black)"
                  text={assignment.publisher}
                />
              </TableCell>

              <TableCell>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                  noWrap
                >
                  {assignment.assignedOn}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                  noWrap
                >
                  {assignment.returnedOn ?? '–'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssignmentHistory;
