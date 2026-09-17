import { Box } from '@mui/material';
import { MonthHeaderProps } from './index.types';
import useMonthHeader from './useMonthHeader';
import Typography from '@components/typography';

const MonthHeader = ({ month, sx, ...props }: MonthHeaderProps) => {
  const { monthName } = useMonthHeader(month.month);

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography className="h3" color="var(--accent-400)">
        {monthName}
      </Typography>

      <Box
        sx={{
          minWidth: '24px',
          height: '24px',
          padding: '0 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-s)',
          backgroundColor: 'var(--accent-150)',
        }}
      >
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {month.total}
        </Typography>
      </Box>
    </Box>
  );
};

export default MonthHeader;
