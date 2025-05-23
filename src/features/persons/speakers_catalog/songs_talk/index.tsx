import { Box } from '@mui/material';
import { IconSong } from '@components/icons';
import { SongType } from '@definition/songs';
import { SongsTalkType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useSongTalk from './useSongTalk';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const SongsTalk = ({
  talk,
  songs,
  onChange,
  onDelete,
  edit = true,
}: SongsTalkType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const { songsOption, selectedSongs } = useSongTalk(songs);

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

      {!edit && (
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
      )}

      {edit && (
        <AutocompleteMultiple
          fullWidth={true}
          options={songsOption}
          getOptionLabel={(option: SongType) => option.song_number.toString()}
          value={selectedSongs}
          onChange={(_, value: SongType[]) => onChange(talk.talk_number, value)}
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
          label={t('tr_songs')}
          height={40}
          renderValue={(value: SongType[]) =>
            value.map((option: SongType) => {
              return (
                <MiniChip
                  key={option.song_number}
                  label={option.song_number.toString()}
                  edit={true}
                  onDelete={() =>
                    onDelete(talk.talk_number, option.song_number)
                  }
                />
              );
            })
          }
        />
      )}
    </Box>
  );
};

export default SongsTalk;
