import { useAppTranslation } from '@hooks/index';
import { TalkTitleSoloType } from './index.types';
import TextField from '@components/textfield';
import useTalkTitleSolo from './useTalkTitleSolo';

const TalkTitleSolo = (props: TalkTitleSoloType) => {
  const { t } = useAppTranslation();

  const { handleTitleChange, handleTitleSave, title } = useTalkTitleSolo(props);

  return (
    <TextField
      sx={{ width: '100%' }}
      height={48}
      label={props.label || t('tr_publicTalk')}
      value={title}
      onChange={(e) => handleTitleChange(e.target.value)}
      onKeyUp={handleTitleSave}
      slotProps={{ input: { readOnly: props.readOnly } }}
    />
  );
};

export default TalkTitleSolo;
