import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDutiesPreventConflict from './usePreventConflict';
import SwitchWithLabel from '@components/switch_with_label';

const DutiesPreventConflict = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor } = useCurrentUser();

  const { value, handleValueChange } = useDutiesPreventConflict();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesPreventConflict')}
      helper={t('tr_dutiesPreventConflictDesc')}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isMidweekEditor}
    />
  );
};

export default DutiesPreventConflict;
