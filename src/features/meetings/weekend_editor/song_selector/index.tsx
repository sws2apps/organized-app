import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SongSelectorProps } from './index.types';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import useSongSelector from './useSongSelector';
import Button from '@components/button';
import Radio from '@components/radio';
import Badge from '@components/badge';

const SongSelector = (props: SongSelectorProps) => {
  const { t } = useAppTranslation();

  const {
    handleClose,
    selectorOpen,
    songsOptions,
    handleSelectSong,
    selected,
    isSongDisabled,
    handleAddSong,
  } = useSongSelector(props);

  return (
    <Dialog onClose={handleClose} open={selectorOpen} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography className="h3">{t('tr_selectSong')}</Typography>

          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <IconClose color="var(--grey-400)" />
          </IconButton>
        </Box>

        <Typography color="var(--grey-400)">
          {t('tr_selectSongDesc')}
        </Typography>

        <RadioGroup
          value={selected}
          onChange={(e) => handleSelectSong(e.target.value)}
          sx={{ gap: '4px', paddingLeft: '8px' }}
        >
          {songsOptions.map((song) => (
            <Stack key={song.song_number}>
              <FormControlLabel
                value={song.song_number.toString()}
                label={song.song_title}
                disabled={isSongDisabled(song.song_number)}
                control={<Radio />}
                sx={{ color: 'var(--black)' }}
              />

              {isSongDisabled(song.song_number) && (
                <Badge
                  size="small"
                  color="red"
                  text={t('tr_alreadyInSchedule')}
                  sx={{ width: 'fit-content', marginLeft: '20px' }}
                />
              )}
            </Stack>
          ))}
        </RadioGroup>

        <Stack spacing="8px">
          <Button variant="main" onClick={handleAddSong}>
            {t('tr_addSong')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('tr_skip')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default SongSelector;
