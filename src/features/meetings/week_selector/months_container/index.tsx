import { Box } from '@mui/material';
import { MonthsContainerType } from './index.types';
import MonthItem from '../month_item';
import useMonthsContainer from './useMonthsContainer';

const MonthsContainer = ({ months, reverse = false }: MonthsContainerType) => {
  const displayedMonths = reverse ? [...months].reverse() : months;

  const { currentExpanded, handleSetExpanded } = useMonthsContainer();

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
      {displayedMonths.map((month) => (
        <MonthItem
          key={month.value}
          month={month.value}
          weeks={month.weeks}
          currentExpanded={currentExpanded}
          onChangeCurrentExpanded={handleSetExpanded}
        />
      ))}
    </Box>
  );
};

export default MonthsContainer;
