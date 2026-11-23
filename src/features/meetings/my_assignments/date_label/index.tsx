import { Box } from '@mui/material';
import { DateLabelProps } from './index.types';
import useDateLabel from './useDateLabel';
import Typography from '@components/typography';

/**
 * Day number over the weekday. The spacing puts the number in front of an
 * assignment title and the weekday in front of its first details line.
 */
const DateLabel = ({ date, sx }: DateLabelProps) => {
  const { day, weekday } = useDateLabel(date);

  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          paddingTop: '8px',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography className="h2" sx={{ '&.h2': { lineHeight: '20px' } }}>
        {day}
      </Typography>

      <Typography
        className="label-small-medium"
        color="var(--grey-350)"
        sx={{ textTransform: 'uppercase' }}
      >
        {weekday}
      </Typography>
    </Box>
  );
};

export default DateLabel;
