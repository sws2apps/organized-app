import { Box, IconButton } from '@mui/material';
import { IconClose } from '@components/icons';
import { SpeakerDetailsType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useSpeakerDetails from './useSpeakerDetails';
import Badge from '@components/badge';
import Dialog from '@components/dialog';
import SpeakerTalksSongs from './talks_songs';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import SpeakerContactInfo from './contact_info';

const SpeakerDetails = ({ open, onClose, speaker }: SpeakerDetailsType) => {
  const { t } = useAppTranslation();

  const { personName, speakerCongName } = useSpeakerDetails(speaker);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '16px', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--accent-200)',
          paddingBottom: '8px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <Typography className="h2">{personName}</Typography>
          {speaker.speaker_data.elder.value && (
            <Badge
              text={t('tr_elder')}
              color="green"
              size="small"
              filled={false}
              sx={{ backgroundColor: 'var(--green-secondary)' }}
            />
          )}
          {speaker.speaker_data.ministerial_servant.value && (
            <Badge
              text={t('tr_ministerialServant')}
              color="green"
              size="small"
              filled={false}
              sx={{ backgroundColor: 'var(--green-secondary)' }}
            />
          )}
        </Box>
        <IconButton onClick={onClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          paddingBottom: '16px',
          width: '100%',
        }}
      >
        <Typography>{speakerCongName}</Typography>
        {speaker.speaker_data.person_notes.value.length > 0 && (
          <Typography className="body-small-regular">
            {speaker.speaker_data.person_notes.value}
          </Typography>
        )}
      </Box>

      <Box sx={{ marginTop: '-16px', width: '100%', marginBottom: '-16px' }}>
        <Tabs
          tabs={[
            {
              label: t('tr_speakerTalksSongs'),
              Component: (
                <SpeakerTalksSongs speaker={speaker} onClose={onClose} />
              ),
            },
            {
              label: t('tr_contactInfo'),
              Component: (
                <SpeakerContactInfo speaker={speaker} onClose={onClose} />
              ),
            },
          ]}
        />
      </Box>
    </Dialog>
  );
};

export default SpeakerDetails;
