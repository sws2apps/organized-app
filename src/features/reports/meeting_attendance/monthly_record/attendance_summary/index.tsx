import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { AttendanceSummaryProps } from './index.types';
import useAttendanceSummary from './useAttendanceSummary';
import Typography from '@components/typography';

const AttendanceSummary = (props: AttendanceSummaryProps) => {
  const { t } = useAppTranslation();

  const { value } = useAttendanceSummary(props);

  return (
    <Stack
      spacing="2px"
      borderRadius="var(--radius-l)"
      padding="4px 8px"
      bgcolor={
        props.type === 'midweek'
          ? 'var(--accent-150)'
          : 'var(--green-secondary)'
      }
      height="48px"
      flex={1}
    >
      <Typography
        className="h4"
        sx={{ textAlign: 'center' }}
        color={
          props.type === 'midweek'
            ? 'var(--accent-dark)'
            : 'var(--weekend-meeting)'
        }
      >
        {value}
      </Typography>
      <Typography
        className="label-small-regular"
        sx={{ textAlign: 'center' }}
        color={
          props.type === 'midweek'
            ? 'var(--accent-400)'
            : 'var(--weekend-meeting)'
        }
      >
        {props.summary === 'total' ? t('tr_total') : t('tr_average')}
      </Typography>
    </Stack>
  );
};

export default AttendanceSummary;
