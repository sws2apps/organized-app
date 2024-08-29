import { Stack } from '@mui/material';
import { ReportDailyProps } from './index.types';
import useReportDaily from './useReportDaily';
import Dialog from '@components/dialog';
import ServiceTime from './service_time';
import BibleStudy from './bible_study';

const ReportDaily = (props: ReportDailyProps) => {
  const { bibleStudyOpen, dateValue, handleDateChange, maxDate, minDate } =
    useReportDaily(props);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ padding: 0 }}
      PaperProps={{
        className: 'pop-up-shadow',
        style: {
          maxWidth: '560px',
          backgroundColor: 'unset',
        },
      }}
    >
      <Stack spacing="16px" width="100%">
        <ServiceTime
          isEdit={props.isEdit}
          onClose={props.onClose}
          date={dateValue}
          maxDate={maxDate}
          minDate={minDate}
          onDateChange={handleDateChange}
        />

        {bibleStudyOpen && <BibleStudy />}
      </Stack>
    </Dialog>
  );
};

export default ReportDaily;
