import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { WithdrawReportProps } from './index.types';
import useWithdrawReport from './useWithdrawReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const WithdrawReportDialog = (props: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleWithdrawal } = useWithdrawReport(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_undoSubmission')}</Typography>

      <Typography color="var(--grey-400)">
        {t('tr_undoSubmissionDesc')}
      </Typography>

      <Stack spacing="8px" width="100%">
        <Button
          variant="main"
          onClick={handleWithdrawal}
          disabled={isProcessing}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
        >
          {t('tr_yes')}
        </Button>
        <Button
          variant="secondary"
          onClick={props.onClose}
          disabled={isProcessing}
        >
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default WithdrawReportDialog;
