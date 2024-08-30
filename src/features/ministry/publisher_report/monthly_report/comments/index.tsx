import { useAppTranslation } from '@hooks/index';
import useComments from './useComments';
import TextField from '@components/textfield';

const Comments = () => {
  const { t } = useAppTranslation();

  const { comments, handleCommentsChange } = useComments();

  return (
    <TextField
      placeholder={t('tr_comments')}
      multiline
      rows={2}
      value={comments}
      onChange={(e) => handleCommentsChange(e.target.value)}
    />
  );
};

export default Comments;
