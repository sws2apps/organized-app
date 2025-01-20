import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { IconDelete, IconMale, IconSong } from '@components/icons';
import { IncomingSpeakerEditType } from './index.types';
import { FullnameOption } from '@definition/settings';
import { PublicTalkType } from '@definition/public_talks';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useEdit from './useEdit';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import MiniChip from '@components/mini_chip';
import PopupSongAdd from '@features/persons/speakers_catalog/song_add_popup';
import Radio from '@components/radio';
import SpeakerDetails from '@features/persons/speakers_catalog/speaker_details';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const IncomingSpeakerEdit = ({ speaker }: IncomingSpeakerEditType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    fullnameOption,
    displayNameEnabled,
    handleFirstnameChange,
    firstname,
    handleLastnameChange,
    lastname,
    handleToggleGender,
    speakerGender,
    email,
    handleEmailChange,
    handleNoteChange,
    handlePhoneChange,
    note,
    phone,
    displayName,
    handleDisplayNameChange,
    selectedTalks,
    publicTalks,
    handleTalksUpdate,
    handleTalksDelete,
    openSongAdd,
    openSpeakerDetails,
    addedTalk,
    selectedSongs,
    handleCloseSongAdd,
    handleCloseSpeakerDetails,
    handleOpenSpeakerDetails,
    handleSongsTalkDelete,
    handleSongsTalkUpdate,
    handleDeleteSpeaker,
  } = useEdit(speaker);

  const { tablet600Down } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {openSongAdd && (
        <PopupSongAdd
          open={openSongAdd}
          talk={addedTalk}
          onClose={handleCloseSongAdd}
          onChange={handleSongsTalkUpdate}
          onDelete={handleSongsTalkDelete}
          songs={selectedSongs}
        />
      )}

      {openSpeakerDetails && (
        <SpeakerDetails
          onClose={handleCloseSpeakerDetails}
          open={openSpeakerDetails}
          speaker={speaker}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown
            ? fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'column'
              : 'column-reverse'
            : fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'row'
              : 'row-reverse',
        }}
      >
        <TextField
          label={t('tr_firstname')}
          styleIcon={false}
          startIcon={
            fullnameOption === FullnameOption.FIRST_BEFORE_LAST ? (
              <IconMale />
            ) : null
          }
          value={firstname}
          onChange={(e) => handleFirstnameChange(e.target.value)}
        />
        <TextField
          label={t('tr_lastname')}
          styleIcon={false}
          startIcon={
            fullnameOption === FullnameOption.LAST_BEFORE_FIRST ? (
              <IconMale />
            ) : null
          }
          value={lastname}
          onChange={(e) => handleLastnameChange(e.target.value)}
        />
      </Box>

      {displayNameEnabled && (
        <TextField
          label={t('tr_displayName')}
          value={displayName}
          onChange={(e) => handleDisplayNameChange(e.target.value)}
        />
      )}

      <RadioGroup
        sx={{
          marginLeft: '4px',
          flexDirection: 'row',
          gap: tabletDown ? '16px' : '24px',
          flexWrap: 'wrap',
        }}
        value={speakerGender}
        onChange={(e) => handleToggleGender(e.target.value)}
      >
        <FormControlLabel
          value="elder"
          control={<Radio />}
          label={<Typography>{t('tr_elder')}</Typography>}
        />
        <FormControlLabel
          value="ms"
          control={<Radio />}
          label={<Typography>{t('tr_ministerialServant')}</Typography>}
        />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <TextField
          label={t('tr_email')}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        <TextField
          label={t('tr_phoneNumber')}
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />
      </Box>

      <TextField
        label={t('tr_shortNote')}
        value={note}
        onChange={(e) => handleNoteChange(e.target.value)}
      />

      <AutocompleteMultiple
        fullWidth={true}
        options={publicTalks}
        getOptionLabel={(option: PublicTalkType) =>
          option.talk_number.toString()
        }
        value={selectedTalks}
        onChange={(e, value: PublicTalkType[]) => handleTalksUpdate(value)}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ margin: 0, padding: 0 }}
            key={option.talk_number}
          >
            <Typography>
              {option.talk_number}. {option.talk_title}
            </Typography>
          </Box>
        )}
        label={t('tr_publicTalks')}
        height={40}
        renderTags={(tagValue) =>
          tagValue.map((option) => (
            <MiniChip
              key={option.talk_number}
              label={option.talk_number.toString()}
              edit={true}
              onDelete={() => handleTalksDelete(option.talk_number)}
            />
          ))
        }
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: tablet600Down ? 'nowrap' : 'wrap',

          gap: '8px',
          justifyContent:
            selectedTalks.length > 0 ? 'space-between' : 'flex-end',
        }}
      >
        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          sx={{
            height: '32px',
            minHeight: '32px !important',
            justifySelf: 'flex-end',
            width: tablet600Down ? 'fit-content' : 'auto',
          }}
          onClick={() => handleDeleteSpeaker(speaker.person_uid)}
        >
          {t('tr_delete')}
        </Button>
        {selectedTalks.length > 0 && (
          <Button
            variant="small"
            startIcon={<IconSong />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
              width: tablet600Down ? 'fit-content' : 'auto',
            }}
            onClick={handleOpenSpeakerDetails}
          >
            {t('tr_songs')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default IncomingSpeakerEdit;
