import { useAppTranslation } from '@hooks/index';
import TextField from '@components/textfield';

const Comments = () => {
  const { t } = useAppTranslation();

  return <TextField placeholder={t('tr_comments')} multiline rows={2} />;
};

export default Comments;
