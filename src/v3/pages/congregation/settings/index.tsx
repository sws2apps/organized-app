import PageTitle from '@components/page_title';
import CongregationPrivacySection from '@features/congregation/settings/CongregationPrivacySection';
import CongregationSection from '@features/congregation/settings/CongregationSection';
import MeetingSection from '@features/congregation/settings/MeetingSection';
import OverseerSection from '@features/congregation/settings/OverseerSection';
import PublicLinksSection from '@features/congregation/settings/PublicLinksSection';
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
      <CongregationPrivacySection />
      <MeetingSection />
      <OverseerSection />
      <PublicLinksSection />
    </div>
  );
};

export default CongregationSettings;
