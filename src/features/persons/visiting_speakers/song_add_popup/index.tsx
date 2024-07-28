import { Box } from '@mui/material';
import { PopupSongAddType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import SongsTalk from '../songs_talk';

const PopupSongAdd = ({
  open,
  onClose,
  talk,
  songs,
  onChange,
  onDelete,
}: PopupSongAddType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="h2">{t('tr_publicTalkAddSongs')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_publicTalkAddSongsDesc')}
        </Typography>
      </Box>

      <SongsTalk
        onChange={onChange}
        onDelete={onDelete}
        songs={songs}
        talk={talk}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={onClose}>
          {t('tr_done')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default PopupSongAdd;
