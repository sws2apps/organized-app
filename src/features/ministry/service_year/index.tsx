import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import MonthlyStats from './monthly_stats';
import YearlyStats from './yearly_stats';

const ServiceYearContainer = () => {
  const { desktopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: desktopUp ? 'row' : 'column',
        alignItems: desktopUp ? 'flex-start' : 'stretch',
        '& > .MuiBox-root': {
          width: desktopUp ? '50%' : '100%',
        },
      }}
    >
      <YearlyStats />
      <MonthlyStats />
    </Box>
  );
};

export default ServiceYearContainer;
