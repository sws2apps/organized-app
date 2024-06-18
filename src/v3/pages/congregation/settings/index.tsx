import PageTitle from '@components/page_title';
import CongregationSection from '@features/congregation/settings/CongregationSection';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  return (
    <div
      style={{
        padding: '16px',
      }}
    >
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle title={t('tr_meetingSchedules')} />
      </Box>
      <CongregationSection />
    </div>
  );
};

export default CongregationSettings;
