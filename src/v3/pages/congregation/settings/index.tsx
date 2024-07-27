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
      <Box
        sx={(theme) => ({
          display: 'flex',
          gap: '16px',
          '& > *': { flexBasis: 0 },
          [theme.breakpoints.down(1000)]: {
            '& > *': { flexBasis: 0, flexGrow: 1 },
          },
          [theme.breakpoints.down(800)]: {
            flexDirection: 'column',
            gap: '0',
          },
        })}
      >
        <Box sx={{ flexGrow: 1 }}>
          <CongregationSection />
          <CongregationPrivacySection />
        </Box>
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('desktop')]: {
              minWidth: '400px',
            },
            minWidth: '560px',
            [theme.breakpoints.down(1000)]: {
              minWidth: '300px',
            },
          })}
        >
          <MeetingSection />
          <OverseerSection />
          <PublicLinksSection />
        </Box>
      </Box>
    </div>
  );
};

export default CongregationSettings;
