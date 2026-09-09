import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { AssignmentsDeleteType } from './index.types';
import useAssignmentsDelete from './useAssignmentsDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import WeekRangeSelector from '../week_range_selector';

const AssignmentsDelete = ({
  open,
  onClose,
  meeting,
}: AssignmentsDeleteType) => {
  const { t } = useAppTranslation();

  const {
    handleSetEndWeek,
    handleSetStartWeek,
    isProcessing,
    handleClearAssignments,
  } = useAssignmentsDelete(meeting, onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_clearMultipleAssignments')}
      description={t('tr_clearMultipleDesc')}
    >
      <WeekRangeSelector
        meeting={meeting}
        onStartChange={handleSetStartWeek}
        onEndChange={handleSetEndWeek}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleClearAssignments}
        >
          {t('tr_clearSelectedWeeks')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentsDelete;
