import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { SubmitReportProps } from './index.types';
import useSubmitReport from './useSubmitReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';

const SubmitReport = (props: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const {
    minutes_remains,
    handleKeepMinutesOrClose,
    handleTransferAndSubmit,
    isProcessing,
  } = useSubmitReport(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={
        minutes_remains === 0
          ? t('tr_btnSubmitReport')
          : t('tr_extraTime', { ministryTime: minutes_remains })
      }
      closable={minutes_remains > 0}
    >
      <Typography color="var(--grey-400)">
        {minutes_remains === 0
          ? t('tr_submitReportDesc')
          : t('tr_extraTimeDesc')}
      </Typography>

      <DialogActions>
        <Button
          variant="secondary"
          onClick={handleKeepMinutesOrClose}
          disabled={isProcessing}
        >
          {minutes_remains === 0 ? t('tr_cancel') : t('tr_btnNoKeepIt')}
        </Button>
        <Button
          variant="main"
          onClick={handleTransferAndSubmit}
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
        >
          {minutes_remains === 0 ? t('tr_yes') : t('tr_btnTransfer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitReport;
