import { Box, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SubmitReportProps } from './index.types';
import useSubmitReport from './useSubmitReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const SubmitReport = (props: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const {
    minutes_remains,
    handleKeepMinutesOrClose,
    handleTransferAndSubmit,
    isProcessing,
  } = useSubmitReport(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography className="h2">
          {minutes_remains === 0
            ? t('tr_btnSubmitReport')
            : t('tr_extraTime', { ministryTime: minutes_remains })}
        </Typography>

        {minutes_remains > 0 && (
          <IconButton sx={{ padding: 0 }} onClick={props.onClose}>
            <IconClose color="var(--grey-400)" />
          </IconButton>
        )}
      </Box>

      <Typography color="var(--grey-400)">
        {minutes_remains === 0
          ? t('tr_submitReportDesc')
          : t('tr_extraTimeDesc')}
      </Typography>

      <Stack spacing="8px" width="100%">
        <Button
          variant="main"
          onClick={handleTransferAndSubmit}
          disabled={isProcessing}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
        >
          {minutes_remains === 0 ? t('tr_yes') : t('tr_btnTransfer')}
        </Button>
        <Button
          variant="secondary"
          onClick={handleKeepMinutesOrClose}
          disabled={isProcessing}
        >
          {minutes_remains === 0 ? t('tr_cancel') : t('tr_btnNoKeepIt')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default SubmitReport;
