import { Box, Table, TableBody, TableContainer } from '@mui/material';
import { AssignmentsHistoryType } from './index.types';
import useAssignmentsHistory from './useAssignmentsHistory';
import HistoryRow from './history_row';
import TableHead from '@components/table/TableHead';
import { IconInfo } from '@components/icons';
import Typography from '@components/typography';
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
        <Box
          sx={{
            width: '100%',
            padding: '16px 8px 8px 8px',
            gap: '8px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <IconInfo color="var(--grey-350)" />
          <Typography className="body-small-regular" color="var(--grey-350)">
            {t('tr_personHasNoAssignmentHistory')}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AssignmentsHistory;
