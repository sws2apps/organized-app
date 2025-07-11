import { Box, Popper } from '@mui/material';
import { IconSong } from '@components/icons';
import { SongLocaleType } from '@definition/songs';
import { SongSourceType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useSongSource from './useSongSource';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';

const SongSource = (props: SongSourceType) => {
  const { t } = useAppTranslation();

  const { songTitle, songs, selectedSong, handleSongChange, sourceLang } =
    useSongSource(props);

  return (
    <>
      {props.isEdit && (
        <AutoComplete
          label={props.label || t('tr_songs', { lng: sourceLang })}
          options={songs}
          getOptionLabel={(option: SongLocaleType) => option.song_title}
          value={selectedSong}
          onChange={(_, value: SongLocaleType) => handleSongChange(value)}
          slots={{
            popper: (props) => <Popper {...props} placement="top-start" />,
          }}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ margin: 0, padding: 0 }}
              key={option.song_number}
            >
              <Typography>{option.song_title}</Typography>
            </Box>
          )}
        />
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
