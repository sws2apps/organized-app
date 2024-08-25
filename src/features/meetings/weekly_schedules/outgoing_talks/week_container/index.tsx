import { Stack } from '@mui/material';
import { WeekContainerProps } from './index.types';
import useWeekContainer from './useWeekContainer';
import Divider from '@components/divider';
import ScheduleItem from '../schedule_item';
import Typography from '@components/typography';

const WeekContainer = ({ week }: WeekContainerProps) => {
  const { dateFormatted, scheduleIds } = useWeekContainer(week);

  return (
    <Stack spacing="8px">
      <Typography
        className="h2-caps"
        color="var(--always-white)"
        align="center"
        flex={1}
        sx={{
          padding: '4px 16px',
          borderRadius: 'var(--radius-s)',
          backgroundColor: 'var(--weekend-meeting)',
        }}
      >
        {dateFormatted}
      </Typography>

      <Stack spacing="8px" divider={<Divider color="var(--accent-200)" />}>
        {scheduleIds.map((id) => (
          <ScheduleItem key={id} week={week} schedule_id={id} />
        ))}
      </Stack>
    </Stack>
  );
};

export default WeekContainer;
