import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useCongregationSettings from './useCongregationSettings';
import CircuitOverseer from '@features/congregation/settings/circuit_overseer';
import CongregationBasic from '@features/congregation/settings/congregation_basic';
import CongregationPrivacy from '@features/congregation/settings/congregation_privacy';
import MeetingForms from '@features/congregation/settings/meeting_forms';
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';
import ImportExport from '@features/congregation/settings/import_export';
import Button from '@components/button';
import { IconImportExport } from '@components/icons';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { handleCloseExchange, isDataExchangeOpen, handleOpenExchange } =
    useCongregationSettings();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_congregationSettings')}
        buttons={
          <Button startIcon={<IconImportExport />} onClick={handleOpenExchange}>
            {t('tr_importExport')}
          </Button>
        }
      />

      {isDataExchangeOpen && (
        <ImportExport open={isDataExchangeOpen} onClose={handleCloseExchange} />
      )}

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
