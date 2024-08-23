import { Box } from '@mui/material';
import { WeekSelectorProps } from './index.types';
import useWeekSelector from './useWeekSelector';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = (props: WeekSelectorProps) => {
  const { weeksTab, handleWeekChange, currentTab } = useWeekSelector(props);

  return (
    <Box sx={{ marginTop: '-16px', marginBottom: '-32px' }}>
      <ScrollableTabs
        className="schedules-view-week-selector"
        tabs={weeksTab}
        value={currentTab}
        onChange={handleWeekChange}
      />
    </Box>
  );
};

export default WeekSelector;
