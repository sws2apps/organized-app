import { Box } from '@mui/material';
import { IconSend } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import DailyHistory from '@features/ministry/publisher_report/daily_history';
import MonthlyReport from '@features/ministry/publisher_report/monthly_report';
import PageTitle from '@components/page_title';

const MinistryReport = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_report')}
        buttons={
          <Button variant="main" startIcon={<IconSend />}>
            {t('tr_btnSubmitReport')}
          </Button>
        }
      />

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
