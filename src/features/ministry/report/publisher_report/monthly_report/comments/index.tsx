import { useAppTranslation } from '@hooks/index';
import useComments from './useComments';
import TextField from '@components/textfield';

const Comments = () => {
  const { t } = useAppTranslation();

  const { status, value, handleCommentsChange, readOnly } = useComments();

  return (
    <TextField
      placeholder={t('tr_comments')}
      multiline
      rows={2}
      slotProps={{ input: { readOnly: readOnly || status !== 'pending' } }}
      value={value}
      onChange={(e) => handleCommentsChange(e.target.value)}
    />
  );
};

export default Comments;
