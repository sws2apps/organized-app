import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SpeakerTalk from './SpeakerTalk';

const OutgoingSpeaker = ({ speaker }) => {
  const { t } = useTranslation('ui');

  return (
    <Box
      sx={{
        borderBottom: '2px outset',
        padding: '20px 0 15px 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        flexWrap: 'wrap',
      }}
    >
      <TextField
        label={t('name')}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ maxWidth: '320px' }}
        value={speaker.person_name}
        InputProps={{
          readOnly: true,
        }}
      />
      <SpeakerTalk speaker={speaker} />
    </Box>
  );
};

export default OutgoingSpeaker;
