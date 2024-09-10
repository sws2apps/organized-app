import { Box } from '@mui/material';
import { IconExport } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import PublisherTabs from '@features/reports/publisher_records/publisher_tabs';
import YearsStats from '@features/reports/publisher_records/years_stats';

const PublisherRecords = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_publishersRecords')}
        buttons={
          <Button startIcon={<IconExport />}>{t('tr_exportS21')}</Button>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: 'flex-start',
        }}
      >
        <PublisherTabs />
        <YearsStats />
      </Box>
    </Box>
  );
};

export default PublisherRecords;
