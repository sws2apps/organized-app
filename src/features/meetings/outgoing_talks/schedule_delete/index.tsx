import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { ScheduleDeleteType } from './index.types';
import useAssignmentsDelete from './useScheduleDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const ScheduleDelete = (props: ScheduleDeleteType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteSchedule } = useAssignmentsDelete(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_outgoingTalkDelete')}
      description={t('tr_outgoingTalkDeleteDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleDeleteSchedule}
        >
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDelete;
