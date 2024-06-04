import { Box, IconButton, Table, TableBody, TableContainer } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { AssignmentsHistoryType } from './index.types';
import useAssignmentsHistory from './useAssignmentsHistory';
import Dialog from '@components/dialog';
import HistoryRow from './history_row';
import TableHead from '@components/table/TableHead';
import Typography from '@components/typography';

const AssignmentsHistory = ({ open, onClose, person, history }: AssignmentsHistoryType) => {
  const { t } = useAppTranslation();

  const { handleRequestSort, assignments, order, orderBy, tableColumns } = useAssignmentsHistory(history);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box
        sx={{ display: 'flex', gap: '4px', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography className="h3">{t('tr_assignmentsHistory')}</Typography>
          <Typography color="var(--grey-400)">{person}</Typography>
        </Box>

        <IconButton sx={{ padding: 0 }} onClick={onClose}>
          <IconClose color="var(--grey-400)" />
        </IconButton>
      </Box>

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
          <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={tableColumns} />
          <TableBody
            sx={{
              '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
                borderBottom: 'none',
              },
            }}
          >
            {assignments.map((assignment) => (
              <HistoryRow key={assignment.history_date} assignment={assignment} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default AssignmentsHistory;
