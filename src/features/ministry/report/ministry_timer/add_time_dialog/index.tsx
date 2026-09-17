import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { AddTimeDialogProps } from './index.types';
import useAddTimeDialog from './useAddTimeDialog';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import TimePickerSlider from '@components/time_picker_slider';

const AddTimeDialog = (props: AddTimeDialogProps) => {
  const { t } = useAppTranslation();

  const { handleAddTime, handleValueChange, value } = useAddTimeDialog(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_timeInService')}
      description={t('tr_timeInServiceDesc')}
    >
      <Box
        sx={{
          width: '100%',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TimePickerSlider value={value} onChange={handleValueChange} />
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleAddTime}>
          {t('tr_add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTimeDialog;
