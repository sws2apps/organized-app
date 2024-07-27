import { Table, TableBody, TableContainer } from '@mui/material';
import { AssignmentsHistoryType } from './index.types';
import useAssignmentsHistory from './useAssignmentsHistory';
import HistoryRow from './history_row';
import TableHead from '@components/table/TableHead';

const AssignmentsHistory = ({
  history,
  isDialog = true,
}: AssignmentsHistoryType) => {
  const { handleRequestSort, assignments, order, orderBy, tableColumns } =
    useAssignmentsHistory(history);

  return (
    <TableContainer>
      <Table
        stickyHeader
        size="small"
        sx={{
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: 'var(--white)',
          },
          '& .MuiTableCell-root': {
            padding: '8px',
            boxSizing: 'content-box',
          },
        }}
      >
        <TableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          columns={tableColumns}
        />
        <TableBody
          sx={{
            '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          {assignments.map((assignment) => (
            <HistoryRow
              key={assignment.history_id}
              assignment={assignment}
              isDialog={isDialog}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssignmentsHistory;
