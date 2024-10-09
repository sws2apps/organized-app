import { useAppTranslation } from '@hooks/index';
import { CommentsProps } from './index.types';
import useComments from './useComments';
import TextField from '@components/textfield';

const Comments = ({ person }: CommentsProps) => {
  const { t } = useAppTranslation();

  const { value, handleCommentsChange, readOnly } = useComments(person);

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
