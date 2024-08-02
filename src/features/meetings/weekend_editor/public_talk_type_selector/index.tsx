import { FormControlLabel, RadioGroup } from '@mui/material';
import { PublicTalkTypeSelectorType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePublicTalkTypeSelector from './usePublicTalkTypeSelector';
import Radio from '@components/radio';
import Typography from '@components/typography';

const PublicTalkTypeSelector = ({ week }: PublicTalkTypeSelectorType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { talkType, handleSaveTalkType } = usePublicTalkTypeSelector(week);

  return (
    <RadioGroup
      row
      sx={{ gap: desktopUp ? '16px' : '8px', marginLeft: '10px' }}
      value={talkType}
      onChange={(e) => handleSaveTalkType(e.target.value)}
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
