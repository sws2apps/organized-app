import { Box } from '@mui/material';
import { IconDelete, IconSong } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { SpeakerEditViewType } from './index.types';
import { PublicTalkType } from '@definition/public_talks';
import useEdit from './useEdit';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import MenuItem from '@components/menuitem';
import MiniChip from '@components/mini_chip';
import PopupSongAdd from '@features/persons/speakers_catalog/song_add_popup';
import Select from '@components/select';
import SpeakerDetails from '@features/persons/speakers_catalog/speaker_details';
import Typography from '@components/typography';
import { buildPersonFullname } from '@utils/common';

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
    fullnameOption,
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
        <SpeakerDetails
          onClose={handleCloseSpeakerDetails}
          open={openSpeakerDetails}
          speaker={speaker}
        />
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
          onChange={(e) => handleChangeSpeaker(e.target.value as string)}
          fullWidth={false}
          sx={{
            flexGrow: 1,
            width: tablet600Down ? '100%' : '280px',
            maxWidth: tablet600Down ? '100%' : '280px',
          }}
        >
          {speakers.map((person) => (
            <MenuItem
              key={person.person_uid}
              value={person.person_uid}
              disabled={
                speakersOnRecord.find(
                  (record) => record.person_uid === person.person_uid
                )
                  ? false
                  : true
              }
            >
              <Typography>
                {buildPersonFullname(
                  person.person_data.person_lastname.value,
                  person.person_data.person_firstname.value,
                  fullnameOption
                )}
              </Typography>
            </MenuItem>
          ))}
        </Select>

        <Box
          sx={{
            flex: 1,
            marginTop: '-10px',
            width: tablet600Down ? '100%' : 'unset',
          }}
        >
          <AutocompleteMultiple
            fullWidth={false}
            options={publicTalks}
            getOptionLabel={(option: PublicTalkType) =>
              option.talk_number.toString()
            }
            filterOptions={(options, params) => {
              const inputValue = params.inputValue.toLowerCase();

              return options.filter((record) => {
                const numberMatch = record.talk_number
                  .toString()
                  .includes(inputValue);

                const titleMatch = record.talk_title
                  .toLowerCase()
                  .includes(inputValue);

                return numberMatch || titleMatch;
              });
            }}
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
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent:
            selectedTalks.length > 0 ? 'space-between' : 'flex-end',
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
          sx={{
            height: '32px',
            minHeight: '32px !important',
            justifySelf: 'flex-end',
          }}
        >
          {t('tr_delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default SpeakerEditView;
