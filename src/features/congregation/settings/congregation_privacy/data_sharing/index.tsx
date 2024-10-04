import { useAppTranslation } from '@hooks/index';
import useDataSharing from './useDataSharing';
import SwitchWithLabel from '@components/switch_with_label';

const DataSharing = () => {
  const { t } = useAppTranslation();

  const { value, handleToggleValue } = useDataSharing();

  return (
    <SwitchWithLabel
      label={t('tr_enableCongregationDataSync')}
      helper={t('tr_enableCongregationDataSyncDesc')}
      checked={value}
      onChange={handleToggleValue}
    />
  );
};

export default DataSharing;
