import { useAppTranslation } from '@hooks/index';
import { EventEditorType } from './index.types';
import useEventEditor from './useEventEditor';
import TextField from '@components/textfield';

const EventEditor = (props: EventEditorType) => {
  const { t } = useAppTranslation();

  const { handleTextChange, handleTextSave, text } = useEventEditor(props);

  return (
    <TextField
      label={t('tr_addTextToSchedule')}
      value={text}
      onChange={(e) => handleTextChange(e.target.value)}
      onKeyUp={handleTextSave}
    />
  );
};

export default EventEditor;
