import { Box, TableCell, TableRow } from '@mui/material';
import Typography from '@components/typography';
import { TalkRowType } from './index.types';

const TalkRow = ({ talk }: TalkRowType) => {
  return (
    <TableRow
      sx={{
        height: '48px',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          '& .MuiTypography-root': {
            color: 'var(--accent-dark)',
          },
          '& .MuiTableCell-root': {
            backgroundColor: 'var(--accent-150)',
          },
        },
      }}
    >
      <TableCell>
        <Typography className="h4">{talk.talk_number}</Typography>
      </TableCell>
      <TableCell>
        <Box
          sx={{ borderRight: '1px solid var(--accent-200)', minHeight: '48px', display: 'flex', alignItems: 'center' }}
        >
          <Typography className="h4">{talk.talk_title}</Typography>
        </Box>
      </TableCell>
      {[
        { date: '09/30', name: 'R. Alexander' },
        {},
        { date: '03/15', name: 'J. Emmanuel' },
        {},
        { date: '11/03', name: 'A. Cody' },
      ].map((history, index) => (
        <TableCell key={`${history.date}-${index}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography className="body-small-semibold">{history.date}</Typography>
            <Typography align="center" className="body-small-regular">
              {history.name}
            </Typography>
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TalkRow;
