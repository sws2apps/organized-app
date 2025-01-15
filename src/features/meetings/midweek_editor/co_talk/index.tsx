import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '@features/meetings/shared_styles';
import { COTalkType } from './index.types';
import useCOTalk from './useCOTalk';
import TextField from '@components/textfield';
import PersonSelector from '@features/meetings/person_selector';

const COTalk = (props: COTalkType) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { handleTextChange, handleTextSave, talkTitle } = useCOTalk(props);

  return (
    <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
      <PrimaryFieldContainer>
        <TextField
          label={t('tr_coTalk')}
          height={48}
          value={talkTitle}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyUp={handleTextSave}
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
        <PersonSelector
          week={props.week}
          label={t('tr_circuitOverseer')}
          assignment="MM_CircuitOverseer"
          circuitOverseer={true}
        />
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default COTalk;
