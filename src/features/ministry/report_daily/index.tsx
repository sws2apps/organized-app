import { Stack } from '@mui/material';
import { ReportDailyProps } from './index.types';
import Dialog from '@components/dialog';
import ServiceTime from './service_time';
import BibleStudy from './bible_study';

const ReportDaily = ({ open, onClose, isEdit }: ReportDailyProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ padding: 0 }}
      PaperProps={{
        style: {
          maxWidth: '560px',
          backgroundColor: 'unset',
        },
      }}
    >
      <Stack spacing="16px" width="100%" className="pop-up-shadow">
        <ServiceTime isEdit={isEdit} onClose={onClose} />
        <BibleStudy />
      </Stack>
    </Dialog>
  );
};

export default ReportDaily;
