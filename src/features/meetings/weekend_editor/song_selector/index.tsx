import { Box, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SongSelectorProps } from './index.types';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import useSongSelector from './useSongSelector';
import Button from '@components/button';

const SongSelector = (props: SongSelectorProps) => {
  const { t } = useAppTranslation();

  const { handleClose, selectorOpen } = useSongSelector(props);

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

        <Stack spacing="8px">
          <Button variant="main">{t('tr_addSong')}</Button>
          <Button variant="secondary">{t('tr_skip')}</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default SongSelector;
