import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { SpeakerTalksSongsType } from './index.types';
import useTalksSongs from './useTalksSongs';
import SongsTalk from '../../songs_talk';

const SpeakerTalksSongs = ({ speaker, edit }: SpeakerTalksSongsType) => {
  const { t } = useAppTranslation();

  const { talks, handleSongsTalkDelete, handleSongsTalkUpdate } = useTalksSongs(speaker);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography color="var(--grey-400)">{t('tr_speakerTalksSongsDesc')}</Typography>

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
            onChange={handleSongsTalkUpdate}
            onDelete={handleSongsTalkDelete}
            edit={edit}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SpeakerTalksSongs;
