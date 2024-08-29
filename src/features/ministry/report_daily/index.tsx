import { Stack } from '@mui/material';
import { ReportDailyProps } from './index.types';
import useReportDaily from './useReportDaily';
import Dialog from '@components/dialog';
import ServiceTime from './service_time';
import BibleStudy from './bible_study';

const ReportDaily = ({ open, onClose, isEdit }: ReportDailyProps) => {
  const { bibleStudyOpen } = useReportDaily();

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <ServiceTime isEdit={isEdit} onClose={onClose} />

        {bibleStudyOpen && <BibleStudy />}
      </Stack>
    </Dialog>
  );
};

export default ReportDaily;
