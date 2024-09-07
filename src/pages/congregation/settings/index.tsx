import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import CircuitOverseer from '@features/congregation/settings/circuit_overseer';
import CongregationBasic from '@features/congregation/settings/congregation_basic';
import CongregationPrivacy from '@features/congregation/settings/congregation_privacy';
import MeetingForms from '@features/congregation/settings/meeting_forms';
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_congregationSettings')} />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <CongregationBasic />
          <CongregationPrivacy />
        </Box>

        <Box
          sx={{
            flex: 0.8,
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <MeetingForms />
          <MinistrySettings />
          <CircuitOverseer />
        </Box>
      </Box>
    </Box>
  );
};

export default CongregationSettings;
