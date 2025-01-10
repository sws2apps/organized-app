import { Box } from '@mui/material';
import { AssignmentsWeekDeleteType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useAssignmentsDelete from './useAssignmentsWeekDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const AssignmentsWeekDelete = ({
  open,
  onClose,
  meeting,
  week,
  schedule_id,
}: AssignmentsWeekDeleteType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleClearAssignments } = useAssignmentsDelete(
    week,
    meeting,
    onClose,
    schedule_id
  );

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{t('tr_clearAllAssignments')}</Typography>
        <Typography color="var(--grey-400)">
          {schedule_id
            ? t('tr_clearOutgoingTalkDesc')
            : t('tr_clearAllAssignmentsDesc')}
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
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
          onClick={handleClearAssignments}
        >
          {t('tr_clear')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AssignmentsWeekDelete;
