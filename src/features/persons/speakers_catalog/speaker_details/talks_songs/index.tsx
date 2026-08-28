import { Box } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { SpeakerTalksSongsType } from './index.types';
import useTalksSongs from './useTalksSongs';
import Button from '@components/button';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import SongsTalk from '../../songs_talk';

const SpeakerTalksSongs = ({ speaker, onClose }: SpeakerTalksSongsType) => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const {
    talks,
    handleSongsTalkDelete,
    handleSongsTalkUpdate,
    handleToggleEdit,
    isEdit,
    cong_synced,
  } = useTalksSongs(speaker);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {isPublicTalkCoordinator && (
        <Typography color="var(--grey-400)">
          {t('tr_speakerTalksSongsDesc')}
        </Typography>
      )}

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
            edit={isEdit}
          />
        ))}
      </Box>

      {isPublicTalkCoordinator && !cong_synced && (
        <DialogActions>
          <Button variant="secondary" onClick={onClose}>
            {t('tr_cancel')}
          </Button>
          <Button variant="main" onClick={handleToggleEdit}>
            {isEdit ? t('tr_done') : t('tr_songsEdit')}
          </Button>
        </DialogActions>
      )}

      {(!isPublicTalkCoordinator || cong_synced) && (
        <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
          {t('tr_close')}
        </Button>
      )}
    </Box>
  );
};

export default SpeakerTalksSongs;
