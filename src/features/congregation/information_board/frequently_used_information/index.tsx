import useBreakpoints from '@hooks/useBreakpoints';
import useIBPageAnnouncements from '../useIBPageAnnouncements';
import { Box } from '@mui/material';
import InfoNote from '@components/info_note';
import useAppTranslation from '@hooks/useAppTranslation';

const FrequentlyUsedInformation = () => {
  const { tablet688Up } = useBreakpoints();
  const { t } = useAppTranslation();
  const { pinnedAnnouncements, unpinnedAnnouncements } = useIBPageAnnouncements(
    'frequently_used_information'
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          columnCount: tablet688Up ? 2 : 1,
          columnGap: '16px',
        }}
      >
        {pinnedAnnouncements.length === 0 &&
          unpinnedAnnouncements.length === 0 && (
            <InfoNote
              message={t('tr_noAnnouncementsOrFilesYet')}
              variant="card"
            />
          )}
        {pinnedAnnouncements}
        {unpinnedAnnouncements}
      </Box>
    </Box>
  );
};

export default FrequentlyUsedInformation;
