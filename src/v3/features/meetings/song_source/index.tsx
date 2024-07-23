import { Box, Popper } from '@mui/material';
import { SongType } from '@definition/songs';
import { SongSourceType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useSongSource from './useSongSource';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import { IconSong } from '@components/icons';

const SongSource = (props: SongSourceType) => {
  const { t } = useAppTranslation();

  const { songTitle, songs, selectedSong, handleSongChange } = useSongSource(props);

  return (
    <>
      {props.isEdit && (
        <Box sx={{ width: '120px' }}>
          <AutoComplete
            options={songs}
            getOptionLabel={(option: SongType) => option.song_number.toString()}
            value={selectedSong}
            onChange={(_, value: SongType) => handleSongChange(value)}
            PopperComponent={(props) => <Popper {...props} style={{ minWidth: 250 }} placement="top-start" />}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ margin: 0, padding: 0 }} key={option.song_number}>
                <Typography>{option.song_title}</Typography>
              </Box>
            )}
            label={t('tr_songs')}
          />
        </Box>
      )}
      {!props.isEdit && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IconSong color="var(--grey-400)" height={20} width={20} />
          <Typography className="h4">{songTitle}</Typography>
        </Box>
      )}
    </>
  );
};

export default SongSource;
