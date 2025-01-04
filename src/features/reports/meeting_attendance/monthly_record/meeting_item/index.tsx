import { Box, Stack } from '@mui/material';
import { MeetingItemProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMeetingItem from './useMeetingItem';
import AttendanceSummary from '../attendance_summary';
import Typography from '@components/typography';
import WeekBox from '../week_box';

const MeetingItem = ({ type, month }: MeetingItemProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const { weeksCount } = useMeetingItem(month);

  return (
    <Stack spacing="16px">
      <Box
        sx={{
          borderRadius: 'var(--radius-s)',
          padding: '4px 8px',
          backgroundColor:
            type === 'midweek'
              ? 'var(--midweek-meeting)'
              : 'var(--weekend-meeting)',
        }}
      >
        <Typography className="h3" color="var(--always-white)">
          {type === 'midweek' ? t('tr_midweekMeeting') : t('tr_weekendMeeting')}
        </Typography>
      </Box>

      <Stack spacing="16px" direction={tablet600Up ? 'row' : 'column'}>
        {Array.from({ length: weeksCount }, (_, week) => (
          <WeekBox
            key={`present-${week + 1}`}
            index={week + 1}
            month={month}
            type={type}
          />
        ))}
      </Stack>

      <Stack spacing="16px" direction={tablet600Up ? 'row' : 'column'}>
        <AttendanceSummary month={month} type={type} summary="total" />
        <AttendanceSummary month={month} type={type} summary="average" />
      </Stack>
    </Stack>
  );
};

export default MeetingItem;
