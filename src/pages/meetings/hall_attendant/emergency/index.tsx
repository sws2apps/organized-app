import { useId } from 'react';
import {
  IconAdd,
  IconCall,
  IconCheck,
  IconDelete,
  IconEdit,
} from '@components/icons';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useHallInfo from '@features/meetings/hall_attendant/info/useHallInfo';
import PageTitle from '@components/page_title';
import SubpageNavbar from '@components/subpage_navbar';
import Card from '@components/card';
import CardHeader from '@components/card_header';
import Typography from '@components/typography';
import Button from '@components/button';
import TextField from '@features/meetings/hall_attendant/info/autosave_field';
import InfoNote from '@components/info_note';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import BottomMenu from '@layouts/bottom_menu';

const HallEmergency = () => {
  const deleteTitleId = useId();
  const pageTitleId = useId();
  const { t } = useAppTranslation();
  const { desktopUp, tablet688Up } = useBreakpoints();
  const navigate = useNavigate();
  const {
    deleteContactId,
    setDeleteContactId,
    info,
    editing,
    canEditHallInfo,
    toggleEditing,
    addContact,
    changeContact,
    changeInstructions,
  } = useHallInfo();
  const contacts = info.contacts.filter(
    (contact) => !contact._deleted && (editing || /\d/.test(contact.phone))
  );
  const contactToDelete = contacts.find(
    (contact) => contact.id === deleteContactId
  );
  const editButton = canEditHallInfo ? (
    <NavBarButtonGroup>
      <NavBarButton
        text={t(editing ? 'tr_hallDone' : 'tr_edit')}
        icon={editing ? <IconCheck /> : <IconEdit />}
        onClick={toggleEditing}
      />
    </NavBarButtonGroup>
  ) : undefined;
  const content = (
    <>
      <Dialog
        open={editing && !!contactToDelete}
        onClose={() => setDeleteContactId(null)}
        ariaLabelledBy={deleteTitleId}
        sx={{ padding: '24px' }}
      >
        <Stack spacing="8px">
          <Typography id={deleteTitleId} className="h2">
            {t('tr_hallDeleteNumber')}
          </Typography>
          <Typography color="var(--grey-400)" sx={{ overflowWrap: 'anywhere' }}>
            {t('tr_hallDeleteNumberDesc', {
              name:
                contactToDelete?.title ||
                contactToDelete?.phone ||
                t('tr_hallPhone'),
            })}
          </Typography>
        </Stack>
        <DialogActions>
          <Button variant="secondary" onClick={() => setDeleteContactId(null)}>
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            color="red"
            onClick={async () => {
              if (
                deleteContactId &&
                (await changeContact(deleteContactId, { _deleted: true }))
              )
                setDeleteContactId(null);
            }}
          >
            {t('tr_delete')}
          </Button>
        </DialogActions>
      </Dialog>
      <PageTitle
        title={t('tr_hallEmergency')}
        secondaryTitle={t('tr_hallAttendantMode')}
        onBack={() => navigate('/hall-attendant')}
        buttons={tablet688Up ? editButton : undefined}
      />
      {!tablet688Up && (
        <SubpageNavbar
          titleId={pageTitleId}
          title={t('tr_hallEmergency')}
          secondaryTitle={t('tr_hallAttendantMode')}
          backLabel={t('tr_back')}
          onBack={() => navigate('/hall-attendant')}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          padding: tablet688Up ? 0 : '16px',
          paddingBottom:
            !tablet688Up && canEditHallInfo
              ? 'calc(60px + var(--message-glow-small-offset-y) + var(--message-glow-small-blur) + env(safe-area-inset-bottom, 0px))'
              : undefined,
          gap: '16px',
          gridTemplateColumns: desktopUp
            ? 'minmax(0, 1.25fr) minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
          alignItems: 'start',
        }}
      >
        <Card>
          <CardHeader color="red" header={t('tr_hallEmergencyInstructions')} />
          {editing ? (
            <TextField
              draftKey="instructions"
              key={info.type}
              multiline
              minRows={8}
              label={t('tr_hallEmergencyInstructions')}
              value={info.instructions.text}
              onSave={changeInstructions}
            />
          ) : info.instructions.text ? (
            <Typography
              sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
            >
              {info.instructions.text}
            </Typography>
          ) : (
            <InfoNote message={t('tr_hallNoInstructions')} />
          )}
        </Card>
        <Card>
          <Typography className="h2">{t('tr_hallEmergencyNumbers')}</Typography>
          {!contacts.length && <InfoNote message={t('tr_hallNoNumbers')} />}
          {contacts.map((contact) =>
            editing ? (
              <Stack key={contact.id} spacing="8px">
                <TextField
                  draftKey={`contact:${contact.id}:title`}
                  label={t('tr_hallNoteTitle')}
                  value={contact.title}
                  onSave={(value) =>
                    changeContact(contact.id, { title: value })
                  }
                />
                <TextField
                  draftKey={`contact:${contact.id}:phone`}
                  type="tel"
                  label={t('tr_hallPhone')}
                  value={contact.phone}
                  onSave={(value) =>
                    changeContact(contact.id, { phone: value })
                  }
                />
                <Button
                  variant="small"
                  color="red"
                  startIcon={<IconDelete />}
                  minHeight={32}
                  disableAutoStretch
                  sx={{ alignSelf: 'flex-end' }}
                  onClick={() => setDeleteContactId(contact.id)}
                >
                  {t('tr_hallDeleteNumber')}
                </Button>
              </Stack>
            ) : (
              <Button
                key={contact.id}
                variant="soft"
                startIcon={<IconCall />}
                color="red"
                href={
                  contact.phone.trim()
                    ? `tel:${contact.phone.replace(/[^+\d*#;,]/g, '')}`
                    : undefined
                }
                disabled={!contact.phone.trim()}
                sx={{ width: '100%', overflowWrap: 'anywhere' }}
              >
                {contact.title}
                {contact.phone ? ` (${contact.phone})` : ''}
              </Button>
            )
          )}
          {editing && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              minHeight={32}
              disableAutoStretch
              sx={{ alignSelf: 'flex-end' }}
              onClick={addContact}
            >
              {t('tr_hallAddNumber')}
            </Button>
          )}
        </Card>
      </Box>
      {!tablet688Up && editButton && <BottomMenu buttons={editButton} />}
    </>
  );
  return tablet688Up ? (
    content
  ) : (
    <Dialog
      open
      fullScreen
      onClose={() => navigate('/hall-attendant')}
      ariaLabelledBy={pageTitleId}
      PaperProps={{ sx: { backgroundColor: 'var(--accent-100)' } }}
      sx={{ padding: 0, gap: 0, alignItems: 'stretch' }}
    >
      {content}
    </Dialog>
  );
};
export default HallEmergency;
