import { Box } from '@mui/material';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SpeakerTalksTabType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';
import SongsTalk from '../../songs_talk';
import Typography from '@components/typography';

const SpeakerTalksTab = ({
  publicTalks,
  selectedTalks,
  talksWithSongs,
  onTalksUpdate,
  onTalksDelete,
  onSongsUpdate,
  onSongsDelete,
}: SpeakerTalksTabType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_speakerTalksSongsEditDesc')}
      </Typography>

      <AutocompleteMultiple
        fullWidth={true}
        options={publicTalks}
        isOptionEqualToValue={(option, value) =>
          option.talk_number === value.talk_number
        }
        getOptionLabel={(option: PublicTalkLocaleType) =>
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
        onChange={(e, value: PublicTalkLocaleType[]) => onTalksUpdate(value)}
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
        renderValue={(value: PublicTalkLocaleType[]) =>
          value.map((option: PublicTalkLocaleType) => (
            <MiniChip
              key={option.talk_number}
              label={option.talk_number.toString()}
              edit={true}
              onDelete={() => onTalksDelete(option.talk_number)}
            />
          ))
        }
      />

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
        {talksWithSongs.map((record) => (
          <SongsTalk
            key={record.talk.talk_number}
            talk={record.talk}
            songs={record.songs}
            onChange={onSongsUpdate}
            onDelete={onSongsDelete}
            edit={true}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SpeakerTalksTab;
