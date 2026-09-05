import { useId } from 'react';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useHallInfo from '@features/meetings/hall_attendant/info/useHallInfo';
import Card from '@components/card';
import CardHeader from '@components/card_header';
import TextField from '@features/meetings/hall_attendant/info/autosave_field';
import Typography from '@components/typography';
import Button from '@components/button';
import Divider from '@components/divider';
import DialogActions from '@components/dialog_actions';
import Dialog from '@components/dialog';
import InfoNote from '@components/info_note';
import { IconAdd, IconCheck, IconDelete, IconEdit } from '@components/icons';

const HallNotes = () => {
  const deleteTitleId = useId();
  const { t } = useAppTranslation();
  const {
    info,
    editing,
    canEditHallInfo,
    toggleEditing,
    addNote,
    changeNote,
    deleteNoteId,
    setDeleteNoteId,
  } = useHallInfo();
  const notes = info.notes.filter(
    (note) =>
      !note._deleted && (editing || note.title.trim() || note.text.trim())
  );
  const noteToDelete = notes.find((note) => note.id === deleteNoteId);
  return (
    <Card>
      <Dialog
        open={editing && !!noteToDelete}
        onClose={() => setDeleteNoteId(null)}
        ariaLabelledBy={deleteTitleId}
        sx={{ padding: '24px' }}
      >
        <Stack spacing="8px">
          <Typography id={deleteTitleId} className="h2">
            {t('tr_hallDeleteNote')}
          </Typography>
          <Typography color="var(--grey-400)">
            {t('tr_hallDeleteNoteDesc')}
          </Typography>
        </Stack>
        <DialogActions>
          <Button variant="secondary" onClick={() => setDeleteNoteId(null)}>
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            color="red"
            onClick={async () => {
              if (
                deleteNoteId &&
                (await changeNote(deleteNoteId, { _deleted: true }))
              )
                setDeleteNoteId(null);
            }}
          >
            {t('tr_delete')}
          </Button>
        </DialogActions>
      </Dialog>
      <CardHeader header={t('tr_hallNotes')} />
      {!notes.length && <InfoNote message={t('tr_hallNoNotes')} />}
      <Stack spacing="16px" divider={<Divider />}>
        {notes.map((note) => (
          <Stack key={note.id} spacing="8px">
            {editing ? (
              <>
                <TextField
                  draftKey={`note:${note.id}:title`}
                  label={t('tr_hallNoteTitle')}
                  value={note.title}
                  onSave={(value) => changeNote(note.id, { title: value })}
                />
                <TextField
                  draftKey={`note:${note.id}:text`}
                  multiline
                  minRows={3}
                  label={t('tr_hallNoteBody')}
                  value={note.text}
                  onSave={(value) => changeNote(note.id, { text: value })}
                />
                <Button
                  variant="small"
                  color="red"
                  startIcon={<IconDelete />}
                  minHeight={32}
                  disableAutoStretch
                  sx={{ alignSelf: 'flex-end' }}
                  onClick={() => setDeleteNoteId(note.id)}
                >
                  {t('tr_delete')}
                </Button>
              </>
            ) : (
              <>
                <Typography
                  className="body-small-semibold"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {note.title}
                </Typography>
                <Typography
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {note.text}
                </Typography>
              </>
            )}
          </Stack>
        ))}
      </Stack>
      {canEditHallInfo && (
        <Stack
          direction="row"
          spacing="8px"
          sx={{
            flexWrap: 'wrap',
            justifyContent: editing ? 'space-between' : 'flex-end',
          }}
        >
          {editing && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              minHeight={32}
              disableAutoStretch
              onClick={addNote}
            >
              {t('tr_hallAddNote')}
            </Button>
          )}
          <Button
            variant="small"
            startIcon={editing ? <IconCheck /> : <IconEdit />}
            minHeight={32}
            disableAutoStretch
            onClick={toggleEditing}
          >
            {t(editing ? 'tr_hallDone' : 'tr_edit')}
          </Button>
        </Stack>
      )}
    </Card>
  );
};
export default HallNotes;
