import { Table, TableBody, TableContainer } from '@mui/material';
import { AssignmentsHistoryType } from './index.types';
import useAssignmentsHistory from './useAssignmentsHistory';
import HistoryRow from './history_row';
import InfoNote from '@components/info_note';
import TableHead from '@components/table/TableHead';
import { useAppTranslation } from '@hooks/index';

const AssignmentsHistory = ({
  history,
  isDialog = true,
}: AssignmentsHistoryType) => {
  const { handleRequestSort, assignments, order, orderBy, tableColumns } =
    useAssignmentsHistory(history);

  const { t } = useAppTranslation();

  return (
    <>
      <TableContainer sx={{ maxHeight: '350px' }}>
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
              borderColor: 'var(--accent-200)',
            },
          }}
        >
          <TableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={tableColumns}
          />
          {assignments.length !== 0 && (
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
          )}
        </Table>
      </TableContainer>
      {assignments.length === 0 && (
        <InfoNote
          message={t('tr_personHasNoAssignmentHistory')}
          sx={{ padding: '16px 8px 8px 8px' }}
        />
      )}
    </>
  );
};

export default AssignmentsHistory;
