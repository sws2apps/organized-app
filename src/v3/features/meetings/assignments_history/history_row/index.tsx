import { TableCell, TableRow } from '@mui/material';
import { HistoryRowType } from './index.types';
import useHistoryRow from './useHistoryRow';
import Typography from '@components/typography';

const HistoryRow = ({ assignment }: HistoryRowType) => {
  const { history } = useHistoryRow(assignment);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography color="var(--grey-350)">{history.history_date}</Typography>
      </TableCell>
      <TableCell sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography>{history.history_assignment}</Typography>

        {history.history_misc.ayf?.student && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {history.history_misc.ayf.student}
          </Typography>
        )}

        {history.history_misc.ayf?.assistant && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {history.history_misc.ayf.assistant}
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        <Typography color="var(--grey-350)">{history.history_hall}</Typography>
      </TableCell>
    </TableRow>
  );
};

export default HistoryRow;
