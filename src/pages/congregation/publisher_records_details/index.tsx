import { Box } from '@mui/material';
import { IconExport } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import PublisherDetails from '@features/congregation/publisher_records_details/publisher_details';
import YearsStats from '@features/congregation/publisher_records_details/years_stats';

const PublisherRecordsDetails = () => {
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
        <PublisherDetails />
        <YearsStats />
      </Box>
    </Box>
  );
};

export default PublisherRecordsDetails;
