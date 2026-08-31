import { Box, IconButton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconClose } from '@components/icons';
import { SpeakerEditPopupType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';
import useSpeakerEditPopup from './useSpeakerEditPopup';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import DialogActions from '@components/dialog_actions';
import SpeakerInfoTab from './info_tab';
import SpeakerTalksTab from './talks_tab';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const SpeakerEditPopup = (props: SpeakerEditPopupType) => {
  const { open, local = false } = props;

  const { t } = useAppTranslation();

  const fullnameOption = useAtomValue(fullnameOptionState);

  const {
    draft,
    congregationName,
    setContentElement,
    minHeight,
    isNew,
    isValid,
    confirmDiscardOpen,
    handleClose,
    handleKeepEditing,
    handleDiscard,
    tab,
    handleTabChange,
    displayNameEnabled,
    publicTalks,
    personsAvailable,
    talkRows,
    handleFirstnameChange,
    handleLastnameChange,
    handleDisplayNameChange,
    handlePrivilegeChange,
    handleEmailChange,
    handlePhoneChange,
    handleNoteChange,
    handlePersonChange,
    handleRowAdd,
    handleRowRemove,
    handleRowTalkChange,
    handleRowSongsChange,
    handleSave,
  } = useSpeakerEditPopup(props);

  const localName = personsAvailable.find(
    (person) => person.person_uid === draft.person_uid
  );

  const name = local
    ? localName
      ? buildPersonFullname(
          localName.person_data.person_lastname.value,
          localName.person_data.person_firstname.value,
          fullnameOption
        )
      : ''
    : buildPersonFullname(draft.lastname, draft.firstname, fullnameOption);

  if (confirmDiscardOpen) {
    return (
      <Dialog
        onClose={handleKeepEditing}
        open={open}
        sx={{ padding: '16px', gap: '16px' }}
      >
        <Typography className="h2">{t('tr_unsavedChanges')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_speakerDiscardEditsDesc')}
        </Typography>

        <DialogActions>
          <Button variant="secondary" onClick={handleKeepEditing}>
            {t('tr_continueEditing')}
          </Button>
          <Button variant="main" color="red" onClick={handleDiscard}>
            {t('tr_discardChanges')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ padding: '16px', gap: '16px' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--accent-200)',
          paddingBottom: '8px',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography className="h2">
            {name.length === 0
              ? isNew
                ? t('tr_speakersAdd')
                : t('tr_speaker')
              : name}
          </Typography>
          {congregationName.length > 0 && (
            <Typography className="body-small-regular" color="var(--grey-350)">
              {congregationName}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      {local && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            flex: 1,
            minHeight: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingTop: '8px',
            paddingRight: '4px',
          }}
        >
          <SpeakerInfoTab
            draft={draft}
            local={local}
            displayNameEnabled={displayNameEnabled}
            fullnameOption={fullnameOption}
            persons={personsAvailable}
            onFirstnameChange={handleFirstnameChange}
            onLastnameChange={handleLastnameChange}
            onDisplayNameChange={handleDisplayNameChange}
            onPrivilegeChange={handlePrivilegeChange}
            onEmailChange={handleEmailChange}
            onPhoneChange={handlePhoneChange}
            onNoteChange={handleNoteChange}
            onPersonChange={handlePersonChange}
          />

          <Divider color="var(--accent-200)" />

          <SpeakerTalksTab
            publicTalks={publicTalks}
            rows={talkRows}
            onRowAdd={handleRowAdd}
            onRowRemove={handleRowRemove}
            onTalkChange={handleRowTalkChange}
            onSongsChange={handleRowSongsChange}
          />
        </Box>
      )}

      {!local && (
        <Box
          sx={{
            marginTop: '-16px',
            width: '100%',
            marginBottom: '-16px',
            minHeight,
            flex: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          <div ref={setContentElement}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              tabs={[
                {
                  label: t('tr_contactInfo'),
                  Component: (
                    <SpeakerInfoTab
                      draft={draft}
                      local={local}
                      displayNameEnabled={displayNameEnabled}
                      fullnameOption={fullnameOption}
                      persons={personsAvailable}
                      onFirstnameChange={handleFirstnameChange}
                      onLastnameChange={handleLastnameChange}
                      onDisplayNameChange={handleDisplayNameChange}
                      onPrivilegeChange={handlePrivilegeChange}
                      onEmailChange={handleEmailChange}
                      onPhoneChange={handlePhoneChange}
                      onNoteChange={handleNoteChange}
                      onPersonChange={handlePersonChange}
                    />
                  ),
                },
                {
                  label: t('tr_speakerTalksSongs'),
                  Component: (
                    <SpeakerTalksTab
                      publicTalks={publicTalks}
                      rows={talkRows}
                      onRowAdd={handleRowAdd}
                      onRowRemove={handleRowRemove}
                      onTalkChange={handleRowTalkChange}
                      onSongsChange={handleRowSongsChange}
                    />
                  ),
                },
              ]}
            />
          </div>
        </Box>
      )}

      <DialogActions>
        <Button variant="secondary" onClick={handleClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" disabled={!isValid} onClick={handleSave}>
          {isNew ? t('tr_add') : t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpeakerEditPopup;
