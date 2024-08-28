import { useAppTranslation } from '@hooks/index';
import Checkbox from '@components/checkbox';

const MinistryShared = () => {
  const { t } = useAppTranslation();

  return <Checkbox label={t('tr_sharedMinistry')} />;
};

export default MinistryShared;
