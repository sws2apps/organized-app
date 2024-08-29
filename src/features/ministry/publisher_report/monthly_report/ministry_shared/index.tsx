import { useAppTranslation } from '@hooks/index';
import Checkbox from '@components/checkbox';
import useMinistryShared from './useMinistryShared';

const MinistryShared = () => {
  const { t } = useAppTranslation();

  const { checked, handleToggleChecked } = useMinistryShared();

  return (
    <Checkbox
      label={t('tr_sharedMinistry')}
      checked={checked}
      onChange={(e) => handleToggleChecked(e.target.checked)}
    />
  );
};

export default MinistryShared;
