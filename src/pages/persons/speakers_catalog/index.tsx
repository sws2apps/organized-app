import { Box } from '@mui/material';
import { IconAddCongregation } from '@components/icons';
import { Button, PageTitle } from '@components/index';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useSpeakersCatalog from './useSpeakersCatalog';
import MyCongregation from '@features/persons/speakers_catalog/my_congregation';
import OtherCongregations from '@features/persons/speakers_catalog/other_congregations';

const SpeakersCatalog = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { handleIsAddingOpen } = useSpeakersCatalog();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_speakersCatalog')}
        buttons={
          <>
            {isPublicTalkCoordinator && (
              <Button
                variant="main"
                startIcon={<IconAddCongregation color="var(--always-white)" />}
                onClick={handleIsAddingOpen}
              >
                {t('tr_btnAdd')}
              </Button>
            )}
          </>
        }
      />

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
