import { Box, Collapse } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useOutgoing from './useOutgoing';
import Button from '@components/button';
import NoSpeakers from './no_speakers';
import OutgoingSpeakersHeader from './header';
import SpeakerEditView from './speaker_edit';
import SpeakerRowView from '../speaker_row_view';
import Typography from '@components/typography';
import VisibilityToggle from './visibility_toggle';

const OutgoingSpeakers = () => {
  const { t } = useAppTranslation();

  const {
    handleToggleExpanded,
    isExpanded,
    outgoingSpeakers,
    handleToggleEdit,
    isEditMode,
    handleSpeakerAdd,
    localSpeakers,
  } = useOutgoing();

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        padding: '16px',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
      }}
    >
      <OutgoingSpeakersHeader
        expanded={isExpanded}
        onExpandChange={handleToggleExpanded}
        editMode={isEditMode}
        onEditModeChange={handleToggleEdit}
      />

      <Collapse in={isExpanded} unmountOnExit>
        <Box
          sx={{
            borderTop: '1px solid var(--accent-200)',
            marginTop: '16px',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <VisibilityToggle />

          {!isEditMode && outgoingSpeakers.length === 0 && <NoSpeakers />}

          {(isEditMode || outgoingSpeakers.length > 0) && (
            <Typography className="body-small-semibold" color="var(--grey-400)">
              {t('tr_yourOutgoingSpeakers')}
            </Typography>
          )}

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
              {localSpeakers.map((speaker) => (
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
              {localSpeakers.map((speaker) => (
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
      </Collapse>
    </Box>
  );
};

export default OutgoingSpeakers;
