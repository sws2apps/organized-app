import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SpeakerTalksSongsType } from './index.types';
import useTalksSongs from './useTalksSongs';
import Button from '@components/button';
import SongsTalk from '../../songs_talk';

const SpeakerTalksSongs = ({ speaker, onClose }: SpeakerTalksSongsType) => {
  const { t } = useAppTranslation();

  const { talks } = useTalksSongs(speaker);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          '& > .MuiBox-root': {
            borderBottom: '1px solid var(--accent-200)',
            paddingBottom: '16px',
          },
          '& > .MuiBox-root:last-child': {
            borderBottom: 'none',
          },
        }}
      >
        {talks.map((record) => (
          <SongsTalk
            key={record.talk.talk_number}
            talk={record.talk}
            songs={record.songs}
          />
        ))}
      </Box>

      <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
        {t('tr_close')}
      </Button>
    </Box>
  );
};

export default SpeakerTalksSongs;
