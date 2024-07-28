import { RowContainer } from '../index.styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { COTalkType } from './index.types';
import useCOTalk from './useCOTalk';
import TextField from '@components/textfield';

const COTalk = (props: COTalkType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { handleTextChange, handleTextSave, talkTitle } = useCOTalk(props);

  return (
    <RowContainer desktopUp={desktopUp} sx={{ alignItems: 'flex-start' }}>
      <TextField
        label={t('tr_coTalk')}
        value={talkTitle}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyUp={handleTextSave}
      />
    </RowContainer>
  );
};

export default COTalk;
