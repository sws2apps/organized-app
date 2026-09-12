import { Box } from '@mui/material';
import { IconSong } from '@components/icons';
import { SongsTalkType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const SongsTalk = ({ talk, songs }: SongsTalkType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography className="h4">
        {talk.talk_number}. {talk.talk_title}
      </Typography>

      <Box
        sx={{
          marginLeft: '16px',
          display: 'flex',
          alignItems: tabletDown ? 'flex-start' : 'center',
          gap: '8px',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IconSong color="var(--grey-400)" />
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_songs')}:
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          {songs.map((song) => (
            <MiniChip key={song} label={song.toString()} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SongsTalk;
