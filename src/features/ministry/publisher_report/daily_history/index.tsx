import { Box, Stack } from '@mui/material';
import { IconAdd, IconInfo } from '@components/icons';
import { CardContainer } from '../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDailyHistory from './useDailyHistory';
import Button from '@components/button';
import ReportDaily from '@features/ministry/report_daily';
import Typography from '@components/typography';
import DailyRecord from './daily_record';
import Divider from '@components/divider';

const DailyHistory = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    reportMonth,
    dailyReports,
    editorOpen,
    handleCloseEditor,
    handleOpenEditor,
  } = useDailyHistory();

  return (
    <CardContainer>
      {editorOpen && (
        <ReportDaily
          isEdit={false}
          open={editorOpen}
          onClose={handleCloseEditor}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          alignItems: tabletUp && 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Typography className="h2">{t('tr_dailyHistory')}</Typography>
        {reportMonth.length > 0 && (
          <Button
            variant="secondary"
            minHeight={38}
            startIcon={<IconAdd />}
            onClick={handleOpenEditor}
          >
            {t('tr_btnAddRecord')}
          </Button>
        )}
      </Box>

      {dailyReports.length === 0 && (
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IconInfo color="var(--grey-350)" />
          <Typography color="var(--grey-350)">
            {t('tr_noDailyRecordsDesc')}
          </Typography>
        </Box>
      )}

      {dailyReports.length > 0 && (
        <Stack spacing="8px">
          <Divider color="var(--accent-200)" />
          <Stack spacing="8px" divider={<Divider color="var(--accent-200)" />}>
            {dailyReports.map((report) => (
              <DailyRecord key={report.report_date} report={report} />
            ))}
          </Stack>
        </Stack>
      )}
    </CardContainer>
  );
};

export default DailyHistory;
