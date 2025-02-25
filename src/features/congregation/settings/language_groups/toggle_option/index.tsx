import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useToggleOption from './useToggleOption';
import SwitchWithLabel from '@components/switch_with_label';

const ToggleOption = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { value, handleToggle } = useToggleOption();

  return (
    <SwitchWithLabel
      readOnly={!isAdmin}
      label={t('tr_langGroupEnable')}
      helper={t('tr_langGroupEnableDesc')}
      checked={value}
      onChange={(checked) => handleToggle(checked)}
    />
  );
};

export default ToggleOption;
