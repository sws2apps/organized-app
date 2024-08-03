import { Box, IconButton, Popper } from '@mui/material';
import { IconClose, IconTalk } from '@components/icons';
import { PublicTalkOptionType, PublicTalkSelectorType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePublicTalkSelector from './usePublicTalkSelector';
import usePublicTalkTypeSelector from '../weekend_editor/public_talk_type_selector/usePublicTalkTypeSelector';
import Autocomplete from '@components/autocomplete';
import Typography from '@components/typography';

const PublicTalkSelector = ({
  week,
  showSpeakerCount,
}: PublicTalkSelectorType) => {
  const { t } = useAppTranslation();

  const { talkType } = usePublicTalkTypeSelector(week);

  const { talks, selectedTalk, handleTalkChange } = usePublicTalkSelector(week);

  return (
    <Box sx={{ position: 'relative' }}>
      <Autocomplete
        label={t('tr_publicTalk')}
        options={talks}
        isOptionEqualToValue={(option, value) =>
          option.talk_number === value.talk_number
        }
        getOptionLabel={(option: PublicTalkOptionType) =>
          `${option.talk_number}. ${option.talk_title}`
        }
        value={selectedTalk}
        onChange={(_, value: PublicTalkOptionType) => handleTalkChange(value)}
        PopperComponent={(props) => <Popper {...props} placement="top-start" />}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              margin: 0,
              padding: 0,
              '&.Mui-focused': {
                backgroundColor: 'var(--accent-100) !important',
                '& p': {
                  color:
                    option.speakers === 0
                      ? 'var(--accent-350)'
                      : 'var(--accent-dark)',
                },
              },
              '&[aria-selected="true"]': {
                backgroundColor: 'var(--accent-200) !important',
                '& p:nth-of-type(1)': {
                  color:
                    option.speakers === 0
                      ? 'var(--accent-350)'
                      : 'var(--accent-dark)',
                },
                '& p:nth-of-type(2)': {
                  color:
                    option.speakers === 0
                      ? 'var(--accent-350)'
                      : 'var(--accent-400)',
                },
              },
            }}
            key={option.talk_number}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography
                color={
                  option.speakers === 0 ? 'var(--grey-350)' : 'var(--black)'
                }
              >
                {option.talk_number}. {option.talk_title}
              </Typography>

              {showSpeakerCount && (
                <Typography
                  className="body-small-regular"
                  color={
                    option.speakers === 0
                      ? 'var(--grey-350)'
                      : 'var(--grey-400)'
                  }
                >
                  {option.speakers === 0
                    ? t('tr_noSpeakersYet')
                    : t('tr_speakersWithCount', {
                        speakersCount: option.speakers,
                      })}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        clearIcon={
          <IconClose width={20} height={20} sx={{ marginLeft: '-90px' }} />
        }
      />
      {talkType !== 'jwStreamRecording' && (
        <IconButton sx={{ position: 'absolute', right: 30, top: 2 }}>
          <IconTalk color="var(--accent-main)" />
        </IconButton>
      )}
    </Box>
  );
};

export default PublicTalkSelector;
