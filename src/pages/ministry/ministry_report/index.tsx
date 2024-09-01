import { Box } from '@mui/material';
import { IconSend, IconUndo } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMinistryReport from './useMinistryReport';
import Button from '@components/button';
import DailyHistory from '@features/ministry/publisher_report/daily_history';
import MonthlyReport from '@features/ministry/publisher_report/monthly_report';
import PageTitle from '@components/page_title';
import SubmitReport from '@features/ministry/publisher_report/monthly_report/submit_report';
import WithdrawReportDialog from '@features/ministry/publisher_report/monthly_report/withdraw_report';

const MinistryReport = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    submitOpen,
    handleCloseSubmit,
    handleOpenModal,
    status,
    withdrawOpen,
    handleCloseWithdraw,
    shared_ministry,
  } = useMinistryReport();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_report')}
        buttons={
          <Button
            variant="main"
            onClick={handleOpenModal}
            disabled={status === 'confirmed' || !shared_ministry}
            startIcon={status === 'pending' ? <IconSend /> : <IconUndo />}
            color={status !== 'pending' && 'orange'}
          >
            {status === 'pending'
              ? t('tr_btnSubmitReport')
              : t('tr_undoSubmission')}
          </Button>
        }
      />

      {submitOpen && (
        <SubmitReport open={submitOpen} onClose={handleCloseSubmit} />
      )}

      {withdrawOpen && (
        <WithdrawReportDialog
          open={withdrawOpen}
          onClose={handleCloseWithdraw}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: desktopUp ? 'flex-start' : 'stretch',
          '& > .MuiBox-root': {
            width: desktopUp ? '50%' : '100%',
          },
        }}
      >
        <MonthlyReport />
        <DailyHistory />
      </Box>
    </Box>
  );
};

export default MinistryReport;
