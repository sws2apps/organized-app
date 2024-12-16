import { useAppTranslation } from '@hooks/index';
import useMinistryShared from './useMinistryShared';
import Checkbox from '@components/checkbox';

const MinistryShared = () => {
  const { t } = useAppTranslation();

  const { checked, handleCheckedChange, readOnly } = useMinistryShared();

  return (
    <Checkbox
      label={t('tr_sharedMinistry')}
      disabled={!checked && readOnly}
      readOnly={readOnly}
      checked={checked}
      onChange={(e) => handleCheckedChange(e.target.checked)}
    />
  );
};

export default MinistryShared;
