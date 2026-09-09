import { PopupSongAddType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
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
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_publicTalkAddSongs')}
      description={t('tr_publicTalkAddSongsDesc')}
      actions={
        <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
          {t('tr_done')}
        </Button>
      }
    >
      <SongsTalk
        onChange={onChange}
        onDelete={onDelete}
        songs={songs}
        talk={talk}
      />
    </Dialog>
  );
};

export default PopupSongAdd;
