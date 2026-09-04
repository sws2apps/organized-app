import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SpeakersOutgoingProps } from './index.types';
import useSpeakersOutgoing from './useSpeakersOutgoing';
import Button from '@components/button';
import NoSpeakers from '../no_speakers';
import SpeakerEditPopup from '../../speaker_edit_popup';
import SpeakerRowEdit from '../../speaker_row_edit';
import SpeakerRowView from '../../speaker_row_view';

const SpeakersOutgoing = ({ isEditMode }: SpeakersOutgoingProps) => {
  const { t } = useAppTranslation();

  const {
    handleSpeakerAdd,
    speakers,
    speakerToEdit,
    isAdding,
    handleOpenSpeakerEdit,
    handleCloseSpeakerEdit,
  } = useSpeakersOutgoing();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '-24px',
      }}
    >
      {(speakerToEdit || isAdding) && (
        <SpeakerEditPopup
          open={true}
          onClose={handleCloseSpeakerEdit}
          speaker={speakerToEdit}
          local
          outgoing
        />
      )}

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
            <SpeakerRowEdit
              key={speaker.person_uid}
              speaker={speaker}
              onEdit={handleOpenSpeakerEdit}
            />
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

export default SpeakersOutgoing;
