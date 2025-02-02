import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import DailyHistory from '@features/ministry/report/publisher_report/daily_history';
import DelegateReports from '@features/ministry/delegate_reports';
import MonthlyReport from '@features/ministry/report/publisher_report/monthly_report';
import PageTitle from '@components/page_title';

const MinistryReport = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_report')} />

      <Stack spacing="24px">
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

        <DelegateReports />
      </Stack>
    </Box>
  );
};

export default MinistryReport;
