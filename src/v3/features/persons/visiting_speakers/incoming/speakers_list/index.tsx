import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { SpeakersListType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useSpeakersList from './useSpeakersList';
import Button from '@components/button';
import Typography from '@components/typography';
import IncomingSpeakerEdit from './edit';

const SpeakersList = ({ speakers, isEditMode, cong_number }: SpeakersListType) => {
  const { t } = useAppTranslation();

  const { handleVisitingSpeakersAdd } = useSpeakersList();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!isEditMode && speakers.length === 0 && (
        <Typography color="var(--grey-350)">{t('tr_incomingCongregationNoSpeakers')}</Typography>
      )}

      {isEditMode && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            '& > .MuiBox-root': {
              borderBottom: '1px solid var(--accent-200)',
              paddingBottom: '16px',
            },
            '& > .MuiBox-root:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          {speakers.map((speaker) => (
            <IncomingSpeakerEdit key={speaker.person_uid} speaker={speaker} />
          ))}
        </Box>
      )}

      {isEditMode && (
        <Button
          variant="tertiary"
          startIcon={<IconAdd />}
          sx={{ width: '100%' }}
          onClick={() => handleVisitingSpeakersAdd(cong_number)}
        >
          {t('tr_speakersAdd')}
        </Button>
      )}
    </Box>
  );
};

export default SpeakersList;
