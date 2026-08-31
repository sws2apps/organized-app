import { Box, IconButton } from '@mui/material';
import { IconAdd, IconDelete } from '@components/icons';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongLocaleType } from '@definition/songs';
import { SpeakerTalksTabType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useTalksTab from './useTalksTab';
import Autocomplete from '@components/autocomplete';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const SpeakerTalksTab = ({
  publicTalks,
  rows,
  onRowAdd,
  onRowRemove,
  onTalkChange,
  onSongsChange,
}: SpeakerTalksTabType) => {
  const { t } = useAppTranslation();

  const { songs, talkOptions, songValues } = useTalksTab(publicTalks, rows);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_speakerTalksSongsEditDesc')}
      </Typography>

      {rows.map((row) => (
        <Box
          key={row.key}
          sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                label={t('tr_publicTalk')}
                options={talkOptions(row)}
                getOptionLabel={(option: PublicTalkLocaleType) =>
                  `${option.talk_number}. ${option.talk_title}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.talk_number === value.talk_number
                }
                value={row.talk}
                onChange={(_, value: PublicTalkLocaleType) =>
                  onTalkChange(row, value)
                }
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
              />
            </Box>

            <IconButton
              sx={{
                width: '48px',
                height: '48px',
                flexShrink: 0,
                borderRadius: 'var(--radius-l)',
                border: '1px solid var(--accent-300)',
                '&:hover': {
                  backgroundColor: 'var(--red-secondary)',
                  borderColor: 'var(--red-main)',
                },
              }}
              title={t('tr_delete')}
              aria-label={t('tr_delete')}
              onClick={() => onRowRemove(row)}
            >
              <IconDelete width={22} height={22} color="var(--red-main)" />
            </IconButton>
          </Box>

          <AutocompleteMultiple
            fullWidth={true}
            options={songs}
            getOptionLabel={(option: SongLocaleType) =>
              option.song_number.toString()
            }
            isOptionEqualToValue={(option, value) =>
              option.song_number === value.song_number
            }
            value={songValues(row)}
            onChange={(_, value: SongLocaleType[]) => onSongsChange(row, value)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ margin: 0, padding: 0 }}
                key={option.song_number}
              >
                <Typography>{option.song_title}</Typography>
              </Box>
            )}
            label={t('tr_songs')}
            height={40}
            renderValue={(value: SongLocaleType[]) =>
              value.map((option: SongLocaleType) => (
                <MiniChip
                  key={option.song_number}
                  label={option.song_number.toString()}
                  edit={true}
                  onDelete={() =>
                    onSongsChange(
                      row,
                      value.filter(
                        (record) => record.song_number !== option.song_number
                      )
                    )
                  }
                />
              ))
            }
          />
        </Box>
      ))}

      <Button
        variant="small"
        startIcon={<IconAdd />}
        sx={{ alignSelf: 'flex-start' }}
        onClick={onRowAdd}
      >
        {t('tr_add')}
      </Button>
    </Box>
  );
};

export default SpeakerTalksTab;
