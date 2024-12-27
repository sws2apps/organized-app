import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { WithdrawReportProps } from './index.types';
import useSubmitReport from './useWithdrawReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const WithdrawReport = (props: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { handleWithdraw } = useSubmitReport(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_undoSubmission')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_undoBranchReportSubmissionDesc')}
        </Typography>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleWithdraw}>
          {t('tr_undoSubmission')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default WithdrawReport;
