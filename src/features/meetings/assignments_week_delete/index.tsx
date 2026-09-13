import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { AssignmentsWeekDeleteType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useAssignmentsDelete from './useAssignmentsWeekDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';

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

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleClearAssignments}
        >
          {t('tr_clear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentsWeekDelete;
