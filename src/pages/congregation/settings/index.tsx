import { Box, Stack } from '@mui/material';
import { IconImportExport } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useCongregationSettings from './useCongregationSettings';
import Button from '@components/button';
import CircuitOverseer from '@features/congregation/settings/circuit_overseer';
import CongregationBasic from '@features/congregation/settings/congregation_basic';
import CongregationPrivacy from '@features/congregation/settings/congregation_privacy';
import ImportExport from '@features/congregation/settings/import_export';
import LanguageGroups from '@features/congregation/settings/language_groups';
import MeetingForms from '@features/congregation/settings/meeting_forms';
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isGroup } = useCurrentUser();

  const { handleCloseExchange, isDataExchangeOpen, handleOpenExchange } =
    useCongregationSettings();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={isGroup ? t('tr_groupSettings') : t('tr_congregationSettings')}
        buttons={
          !isGroup && (
            <Button
              startIcon={<IconImportExport />}
              onClick={handleOpenExchange}
            >
              {t('tr_importExport')}
            </Button>
          )
        }
      />

      {isDataExchangeOpen && (
        <ImportExport open={isDataExchangeOpen} onClose={handleCloseExchange} />
      )}

      {desktopUp && (
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
            }}
          >
            {isGroup && <LanguageGroups />}

            <CongregationBasic />

            {!isGroup && (
              <>
                <LanguageGroups />
                <CongregationPrivacy />
              </>
            )}
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

            {!isGroup && (
              <>
                <MinistrySettings />
                <CircuitOverseer />
              </>
            )}
          </Box>
        </Box>
      )}

      {!desktopUp && (
        <Stack spacing="16px">
          {isGroup && <LanguageGroups />}

          <CongregationBasic />
          <MeetingForms />

          {!isGroup && (
            <>
              <MinistrySettings />
              <CircuitOverseer />
              <LanguageGroups />
              <CongregationPrivacy />
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CongregationSettings;
