import { Box } from '@mui/material';
import { PreachingPartnerConfirmProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useConfirmArrangement from './useConfirmArrangement';
import Badge from '@components/badge';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import PreachingPartnerCalendar from '../add_to_calendar';
import Typography from '@components/typography';

const ConfirmArrangement = (props: PreachingPartnerConfirmProps) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    isCalendarOpen,
    typeLabel,
    scheduleLabel,
    publisherName,
    handleConfirm,
  } = useConfirmArrangement(props);

  if (isCalendarOpen) {
    return (
      <PreachingPartnerCalendar
        open={props.open}
        onClose={props.onClose}
        request={props.request}
      />
    );
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={t('tr_confirmArrangement')}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Badge size="medium" color="orange" text={typeLabel} />

        <Typography className="h4">{scheduleLabel}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_arrangementWith', { publisherName })}
        </Typography>
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>

        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleConfirm}
        >
          {t('tr_confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmArrangement;
