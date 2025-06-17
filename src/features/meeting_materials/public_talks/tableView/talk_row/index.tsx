import { Box, TableCell, TableRow } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { TalkRowType } from './index.types';
import { formatDate } from '@utils/date';
import Typography from '@components/typography';

const TalkRow = ({ talk }: TalkRowType) => {
  const { t } = useAppTranslation();

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
          sx={{
            borderRight: '1px solid var(--accent-200)',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography className="h4">{talk.talk_title}</Typography>
        </Box>
      </TableCell>
      {talk.history.map((history) => (
        <TableCell key={history.year}>
          {history.records.map((record) => (
            <Box
              key={`${record.date}-${record.person}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Typography className="body-small-semibold">
                {formatDate(
                  new Date(record.date),
                  t('tr_shortDateFormatNoYear')
                )}
              </Typography>
              <Typography align="center" className="body-small-regular">
                {record.person}
              </Typography>
            </Box>
          ))}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TalkRow;
