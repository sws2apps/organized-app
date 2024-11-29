import { Stack } from '@mui/material';
import { ReportFormDialogProps } from './index.types';
import useReportFormDialog from './useReportFormDialog';
import Dialog from '@components/dialog';
import ServiceTime from './service_time';
import BibleStudy from './bible_study';

const ReportFormDialog = (props: ReportFormDialogProps) => {
  const {
    bibleStudyOpen,
    dateValue,
    handleDateChange,
    maxDate,
    minDate,
    isEdit,
  } = useReportFormDialog(props);

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
          isEdit={isEdit}
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

export default ReportFormDialog;
