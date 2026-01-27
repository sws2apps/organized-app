import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import PageTitle from '@components/page_title';
import PublisherDetails from '@features/reports/publisher_records_details/publisher_details';
import YearsStats from '@features/reports/publisher_records_details/years_stats';
import ExportS21 from '@features/reports/publisher_records_details/export_S21';

const PublisherRecordsDetails = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle title={t('tr_publishersRecords')} buttons={<ExportS21 />} />

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
