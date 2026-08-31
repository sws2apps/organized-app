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
import DialogActions from '@components/dialog_actions';
import SpeakerInfoTab from './info_tab';
import SpeakerTalksTab from './talks_tab';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const SpeakerEditPopup = (props: SpeakerEditPopupType) => {
  const { open, onClose, local = false } = props;

  const { t } = useAppTranslation();

  const fullnameOption = useAtomValue(fullnameOptionState);

  const {
    draft,
    tab,
    handleTabChange,
    displayNameEnabled,
    publicTalks,
    personsAvailable,
    selectedTalks,
    talksWithSongs,
    handleFirstnameChange,
    handleLastnameChange,
    handleDisplayNameChange,
    handlePrivilegeChange,
    handleEmailChange,
    handlePhoneChange,
    handleNoteChange,
    handlePersonChange,
    handleTalksUpdate,
    handleTalksDelete,
    handleSongsTalkUpdate,
    handleSongsTalkDelete,
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

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '16px', gap: '16px' }}>
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
        <Typography className="h2">
          {name.length === 0 ? t('tr_speaker') : name}
        </Typography>
        <IconButton onClick={onClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <Box sx={{ marginTop: '-16px', width: '100%', marginBottom: '-16px' }}>
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
                  selectedTalks={selectedTalks}
                  talksWithSongs={talksWithSongs}
                  onTalksUpdate={handleTalksUpdate}
                  onTalksDelete={handleTalksDelete}
                  onSongsUpdate={handleSongsTalkUpdate}
                  onSongsDelete={handleSongsTalkDelete}
                />
              ),
            },
          ]}
        />
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleSave}>
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpeakerEditPopup;
