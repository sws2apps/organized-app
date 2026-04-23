import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SpeakersLocalProps } from './index.types';
import useSpeakersLocal from './useSpeakersLocal';
import Button from '@components/button';
import NoSpeakers from '../no_speakers';
import SpeakerEditView from '../speaker_edit';
import SpeakerRowView from '../../speaker_row_view';

const SpeakersLocal = ({ isEditMode }: SpeakersLocalProps) => {
  const { t } = useAppTranslation();

  const { handleSpeakerAdd, speakers } = useSpeakersLocal();
  console.log('speakers', speakers);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '-24px',
      }}
    >
      {!isEditMode && speakers.length === 0 && <NoSpeakers />}

      {!isEditMode && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& > .MuiBox-root': {
              borderBottom: '1px solid var(--accent-200)',
              padding: '4px 0',
            },
            '& > .MuiBox-root:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          {speakers.map((speaker) => (
            <SpeakerRowView key={speaker.person_uid} speaker={speaker} />
          ))}
        </Box>
      )}

      {isEditMode && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            '& > .MuiBox-root': {
              borderBottom: '1px solid var(--accent-200)',
              paddingBottom: '10px',
            },
            '& > .MuiBox-root:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          {speakers.map((speaker) => (
            <SpeakerEditView key={speaker.person_uid} speaker={speaker} />
          ))}
        </Box>
      )}

      {isEditMode && (
        <Button
          variant="tertiary"
          startIcon={<IconAdd />}
          onClick={handleSpeakerAdd}
        >
          {t('tr_speakersAdd')}
        </Button>
      )}
    </Box>
  );
};

export default SpeakersLocal;
