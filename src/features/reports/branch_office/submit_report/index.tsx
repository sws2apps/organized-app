import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SubmitReportProps } from './index.types';
import useSubmitReport from './useSubmitReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const SubmitReport = (props: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const { handleSubmitted } = useSubmitReport(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_markAsSubmitted')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_markToBranchOfficeDesc')}
        </Typography>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleSubmitted}>
          {t('tr_markAsSubmitted')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default SubmitReport;
