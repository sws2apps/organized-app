import { Box } from '@mui/material';
import { MonthsContainerType } from './index.types';
import MonthItem from '../month_item';

const MonthsContainer = ({ months }: MonthsContainerType) => {
  return (
    <Box
      sx={{
        '& > .MuiBox-root': {
          borderBottom: '1px solid var(--accent-200)',
        },
        '& > .MuiBox-root:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {months.map((month) => (
        <MonthItem key={month.value} month={month.value} weeks={month.weeks} />
      ))}
    </Box>
  );
};

export default MonthsContainer;
