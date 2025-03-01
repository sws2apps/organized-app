import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CardContainer } from '../shared_styles';
import useMonthlyRecord from './useMonthlyRecord';
import Divider from '@components/divider';
import MeetingItem from './meeting_item';
import ServiceYearMonthSelector from '@features/reports/service_year_month_selector';
import Typography from '@components/typography';

const MonthlyRecord = () => {
  const { t } = useAppTranslation();

  const { meetings, year, month, handleMonthChange, handleYearChange } =
    useMonthlyRecord();

  return (
    <CardContainer sx={{ flex: 1 }}>
      <Stack spacing="24px" divider={<Divider color="var(--accent-200)" />}>
        <Stack spacing="24px">
          <Stack spacing="8px">
            <Typography className="h2">{t('tr_recordAttendance')}</Typography>
            <Typography color="var(--grey-400)">
              {t('tr_recordAttendanceDesc')}
            </Typography>
          </Stack>

          <ServiceYearMonthSelector
            year={year}
            month={month}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
          />
        </Stack>

        <Stack spacing="24px">
          {meetings.map((meeting) => (
            <MeetingItem key={meeting} type={meeting} month={month} />
          ))}
        </Stack>
      </Stack>
    </CardContainer>
  );
};

export default MonthlyRecord;
