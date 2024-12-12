import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AddTimeDialogProps } from './index.types';
import useAddTimeDialog from './useAddTimeDialog';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TimePickerSlider from '@components/time_picker_slider';
import Typography from '@components/typography';

const AddTimeDialog = (props: AddTimeDialogProps) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { handleAddTime, handleValueChange, value } = useAddTimeDialog(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{t('tr_timeInService')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_timeInServiceDesc')}
        </Typography>
      </Box>

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

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column-reverse',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleAddTime}>
          {t('tr_add')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddTimeDialog;
