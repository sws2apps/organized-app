import { useAppTranslation } from '@hooks/index';
import useComments from './useComments';
import TextField from '@components/textfield';

const Comments = () => {
  const { t } = useAppTranslation();

  const { value, handleCommentsChange, readOnly } = useComments();

  return (
    <TextField
      slotProps={{ input: { readOnly } }}
      placeholder={t('tr_comments')}
      multiline
      rows={2}
      value={value}
      onChange={(e) => handleCommentsChange(e.target.value)}
    />
  );
};

export default Comments;
