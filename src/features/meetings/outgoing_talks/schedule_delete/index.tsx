import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { ScheduleDeleteType } from './index.types';
import useAssignmentsDelete from './useScheduleDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const ScheduleDelete = (props: ScheduleDeleteType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteSchedule } = useAssignmentsDelete(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{t('tr_outgoingTalkDelete')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_outgoingTalkDeleteDesc')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleDeleteSchedule}
        >
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ScheduleDelete;
