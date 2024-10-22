import { FormControlLabel, RadioGroup } from '@mui/material';
import { PublicTalkTypeSelectorType } from './index.types';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import usePublicTalkTypeSelector from './usePublicTalkTypeSelector';
import Radio from '@components/radio';
import Typography from '@components/typography';

const PublicTalkTypeSelector = ({ week }: PublicTalkTypeSelectorType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { talkType, handleSaveTalkType } = usePublicTalkTypeSelector(week);

  return (
    <RadioGroup
      row
      sx={{ gap: desktopUp ? '16px' : '8px', marginLeft: '10px' }}
      value={talkType}
      onChange={(e) => {
        if (!isPublicTalkCoordinator) {
          e.preventDefault();
          return;
        }

        handleSaveTalkType(e.target.value);
      }}
    >
      <FormControlLabel
        value="localSpeaker"
        control={<Radio />}
        label={<Typography>{t('tr_localSpeaker')}</Typography>}
      />
      <FormControlLabel
        value="visitingSpeaker"
        control={<Radio />}
        label={<Typography>{t('tr_visitingSpeaker')}</Typography>}
      />
      <FormControlLabel
        value="jwStreamRecording"
        control={<Radio />}
        label={<Typography>{t('tr_jwStreamRecording')}</Typography>}
      />
    </RadioGroup>
  );
};

export default PublicTalkTypeSelector;
