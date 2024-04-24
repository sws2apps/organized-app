import { Box } from '@mui/material';
import { IconDelete, IconSong } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { SpeakerEditViewType } from './index.types';
import { PublicTalkType } from '@definition/public_talks';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';
import PopupSongAdd from '@features/persons/visiting_speakers/popup_song_add';
import useEdit from './useEdit';
import SpeakerDetails from '@features/persons/visiting_speakers/speaker_details';

const SpeakerEditView = ({ speaker }: SpeakerEditViewType) => {
  const { t } = useAppTranslation();

  const { tablet600Down } = useBreakpoints();

  const {
    speakers,
    handleChangeSpeaker,
    handleDeleteSpeaker,
    selectedSpeaker,
    publicTalks,
    handleTalksUpdate,
    selectedTalks,
    handleTalksDelete,
    addedTalk,
    handleCloseSongAdd,
    openSongAdd,
    handleSongsTalkUpdate,
    selectedSongs,
    handleSongsTalkDelete,
    handleCloseSpeakerDetails,
    handleOpenSpeakerDetails,
    openSpeakerDetails,
    speakersOnRecord,
  } = useEdit(speaker);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        <SpeakerDetails onClose={handleCloseSpeakerDetails} open={openSpeakerDetails} speaker={speaker} />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: tablet600Down ? '26px' : '16px',
          flexWrap: 'wrap',
          flexDirection: tablet600Down ? 'column' : 'row',
        }}
      >
        <Select
          label={t('tr_speaker')}
          value={selectedSpeaker}
          onChange={(e) => handleChangeSpeaker(e.target.value)}
          fullWidth={false}
          sx={{ flexGrow: 1, width: tablet600Down ? '100%' : '280px', maxWidth: tablet600Down ? '100%' : '280px' }}
        >
          {speakers.map((option) => (
            <MenuItem
              key={option.person_uid}
              value={option.person_uid}
              disabled={speakersOnRecord.find((record) => record.person_uid === option.person_uid) ? false : true}
            >
              <Typography className="body-regular" color="var(--black)">
                {option.person_displayName.value}
              </Typography>
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ flex: 1, marginTop: '-10px', width: tablet600Down ? '100%' : 'unset' }}>
          <AutocompleteMultiple
            fullWidth={false}
            options={publicTalks}
            getOptionLabel={(option: PublicTalkType) => option.talk_number.toString()}
            value={selectedTalks}
            onChange={(e, value: PublicTalkType[]) => handleTalksUpdate(value)}
            renderOption={(props, option) => (
              <Box key={option.talk_number} component="li" {...props} sx={{ margin: 0, padding: 0 }}>
                <Typography className="body-regular">
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
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: selectedTalks.length > 0 ? 'space-between' : 'flex-end',
        }}
      >
        {selectedTalks.length > 0 && (
          <Button
            variant="small"
            startIcon={<IconSong />}
            sx={{ height: '32px', minHeight: '32px !important' }}
            onClick={handleOpenSpeakerDetails}
          >
            {t('tr_songs')}
          </Button>
        )}

        <Button
          variant="small"
          color="red"
          onClick={() => handleDeleteSpeaker(speaker.person_uid)}
          startIcon={<IconDelete />}
          sx={{ height: '32px', minHeight: '32px !important', justifySelf: 'flex-end' }}
        >
          {t('tr_delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default SpeakerEditView;
