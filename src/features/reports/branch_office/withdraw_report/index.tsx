import { useAppTranslation } from '@hooks/index';
import { WithdrawReportProps } from './index.types';
import useSubmitReport from './useWithdrawReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const WithdrawReport = (props: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { handleWithdraw } = useSubmitReport(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_undoSubmission')}
      description={t('tr_undoBranchReportSubmissionDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleWithdraw}>
          {t('tr_undoSubmission')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawReport;
