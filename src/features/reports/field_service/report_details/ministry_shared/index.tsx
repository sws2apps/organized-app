import { useAppTranslation } from '@hooks/index';
import { MinistrySharedProps } from './index.types';
import useMinistryShared from './useMinistryShared';
import Checkbox from '@components/checkbox';

const MinistryShared = ({ person }: MinistrySharedProps) => {
  const { t } = useAppTranslation();

  const { checked, handleCheckedChange } = useMinistryShared(person);

  return (
    <Checkbox
      label={t('tr_sharedMinistry')}
      checked={checked}
      onChange={(e) => handleCheckedChange(e.target.checked)}
    />
  );
};

export default MinistryShared;
