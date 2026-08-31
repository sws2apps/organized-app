import { Box } from '@mui/material';
import { IconAdd, IconDelete } from '@components/icons';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongLocaleType } from '@definition/songs';
import { SpeakerTalksTabType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useTalksTab from './useTalksTab';
import Autocomplete from '@components/autocomplete';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import IconButton from '@components/icon_button';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {rows.map((row) => (
        <Box
          key={row.key}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px 16px 16px 20px',
            borderRadius: 'var(--radius-l)',
            backgroundColor: 'var(--accent-100)',
            // the rail ties a talk to its songs without enclosing them
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              borderRadius: 'var(--radius-l) 0 0 var(--radius-l)',
              backgroundColor: 'var(--accent-main)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              color="error"
              sx={{
                borderRadius: 'var(--radius-m)',
                width: '48px',
                height: '48px',
              }}
              title={t('tr_delete')}
              aria-label={t('tr_delete')}
              onClick={() => onRowRemove(row)}
            >
              <IconDelete color="var(--red-main)" />
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
