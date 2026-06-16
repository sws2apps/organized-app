import { Box, Stack } from '@mui/material';
import { IconImportExport } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useCongregationSettings from './useCongregationSettings';
import CircuitOverseer from '@features/congregation/settings/circuit_overseer';
import CongregationBasic from '@features/congregation/settings/congregation_basic';
import CongregationPrivacy from '@features/congregation/settings/congregation_privacy';
import ImportExport from '@features/congregation/settings/import_export';
import LanguageGroups from '@features/congregation/settings/language_groups';
import MeetingForms from '@features/congregation/settings/meeting_forms';
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { isGroup, isAdmin } = useCurrentUser();

  const { handleCloseExchange, isDataExchangeOpen, handleOpenExchange } =
    useCongregationSettings();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={isGroup ? t('tr_groupSettings') : t('tr_congregationSettings')}
        buttons={
          isAdmin &&
          !isGroup && (
            <NavBarButton
              main
              text={t('tr_importExport')}
              icon={<IconImportExport />}
              onClick={handleOpenExchange}
            ></NavBarButton>
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
