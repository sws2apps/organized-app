import { Box, IconButton } from '@mui/material';
import { IconDelete, IconEdit } from '@components/icons';
import { SpeakerRowEditType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import DeleteConfirm from '../delete_confirm';
import useSpeakerRowEdit from './useSpeakerRowEdit';
import Typography from '@components/typography';

const SpeakerRowEdit = ({ speaker, onEdit }: SpeakerRowEditType) => {
  const { t } = useAppTranslation();

  const { mobile400Down } = useBreakpoints();

  const {
    name,
    note,
    talks,
    confirmDeleteOpen,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDeleteSpeaker,
  } = useSpeakerRowEdit(speaker);

  return (
    // the wrapper keeps the row clear of the spacing the list puts on its
    // children, so it lines up with the same row in view mode
    <Box>
      {confirmDeleteOpen && (
        <DeleteConfirm
          open={confirmDeleteOpen}
          title={t('tr_deleteSpeakerTitle', {
            speakerName: name.length === 0 ? t('tr_speaker') : name,
          })}
          description={t('tr_deleteSpeakerDesc')}
          onCancel={handleCloseConfirmDelete}
          onConfirm={handleDeleteSpeaker}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          width: '100%',
          minHeight: '36px',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: mobile400Down ? 'flex-start' : 'center',
            gap: '8px',
            flexDirection: mobile400Down ? 'column' : 'row',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              className="body-small-regular"
              color={name.length === 0 ? 'var(--grey-350)' : 'var(--black)'}
              sx={{
                minWidth: mobile400Down ? 'unset' : '215px',
                width: mobile400Down ? 'unset' : '215px',
              }}
            >
              {name.length === 0 ? t('tr_speaker') : name}
            </Typography>
            {note.length > 0 && (
              <Typography className="label-small-regular">{note}</Typography>
            )}
          </Box>
          <Typography className="body-small-semibold">{talks}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IconButton
            sx={{ padding: 0 }}
            title={t('tr_edit')}
            aria-label={t('tr_edit')}
            onClick={() => onEdit(speaker.person_uid)}
          >
            <IconEdit width={20} height={20} color="var(--accent-main)" />
          </IconButton>

          <IconButton
            sx={{ padding: 0 }}
            title={t('tr_delete')}
            aria-label={t('tr_delete')}
            onClick={handleOpenConfirmDelete}
          >
            <IconDelete width={20} height={20} color="var(--red-main)" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SpeakerRowEdit;
