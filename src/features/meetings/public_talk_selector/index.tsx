import { Box, IconButton, Popper } from '@mui/material';
import { IconClose, IconTalk } from '@components/icons';
import { PublicTalkType } from '@definition/public_talks';
import { PublicTalkSelectorType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePublicTalkSelector from './usePublicTalkSelector';
import usePublicTalkTypeSelector from '../weekend_editor/public_talk_type_selector/usePublicTalkTypeSelector';
import Autocomplete from '@components/autocomplete';
import Typography from '@components/typography';

const PublicTalkSelector = ({ week }: PublicTalkSelectorType) => {
  const { t } = useAppTranslation();

  const { talks, selectedTalk, handleTalkChange } = usePublicTalkSelector(week);

  const { talkType } = usePublicTalkTypeSelector(week);

  return (
    <Box sx={{ position: 'relative' }}>
      <Autocomplete
        label={t('tr_publicTalk')}
        options={talks}
        value={selectedTalk}
        onChange={(_, value: PublicTalkType) => handleTalkChange(value)}
        getOptionLabel={(option: PublicTalkType) =>
          `${option.talk_number}. ${option.talk_title}`
        }
        PopperComponent={(props) => <Popper {...props} placement="top-start" />}
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
