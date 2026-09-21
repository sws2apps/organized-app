import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { WithdrawReportProps } from './index.types';
import useWithdrawReport from './useWithdrawReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const WithdrawReport = (props: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleWithdrawal } = useWithdrawReport(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_undoSubmission')}
      description={t('tr_undoSubmissionDesc')}
    >
      <DialogActions>
        <Button
          variant="secondary"
          onClick={props.onClose}
          disabled={isProcessing}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          onClick={handleWithdrawal}
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawReport;
