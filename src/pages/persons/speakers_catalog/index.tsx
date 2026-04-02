import { Box } from '@mui/material';
import { IconAddCongregation, IconImportExport } from '@components/icons';
import { PageTitle } from '@components/index';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useSpeakersCatalog from './useSpeakersCatalog';
import MyCongregation from '@features/persons/speakers_catalog/my_congregation';
import OtherCongregations from '@features/persons/speakers_catalog/other_congregations';
import NavBarButton from '@components/nav_bar_button';
import ImportExport from '@features/persons/speakers_catalog/import_export';

const SpeakersCatalog = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const {
    handleIsAddingOpen,
    handleOpenExchange,
    isDataExchangeOpen,
    handleCloseExchange,
  } = useSpeakersCatalog();

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
        title={t('tr_speakersCatalog')}
        buttons={
          <>
            {isPublicTalkCoordinator && (
              <>
                <NavBarButton
                  text={t('tr_importExport')}
                  main={false}
                  icon={<IconImportExport />}
                  onClick={handleOpenExchange}
                ></NavBarButton>
                <NavBarButton
                  text={t('tr_btnAdd')}
                  main
                  icon={<IconAddCongregation color="var(--always-white)" />}
                  onClick={handleIsAddingOpen}
                ></NavBarButton>
              </>
            )}
          </>
        }
      />

      {isDataExchangeOpen && (
        <ImportExport open={isDataExchangeOpen} onClose={handleCloseExchange} />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <MyCongregation />
        <OtherCongregations />
      </Box>
    </Box>
  );
};

export default SpeakersCatalog;
