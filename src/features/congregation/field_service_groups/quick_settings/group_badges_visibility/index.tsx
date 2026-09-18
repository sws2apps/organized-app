import SwitchWithLabel from '@components/switch_with_label';
import useAppTranslation from '@hooks/useAppTranslation';
import useGroupBadgesVisibility from './useGroupBadgesVisibility';

const GroupBadgesVisibility = () => {
  const { t } = useAppTranslation();

  const { badgesEnabled, handleBadgesToggle } = useGroupBadgesVisibility();

  return (
    <SwitchWithLabel
      label={t('tr_showGroupBadges')}
      helper={t('tr_showGroupBadgesDesc')}
      checked={badgesEnabled}
      onChange={handleBadgesToggle}
    />
  );
};

export default GroupBadgesVisibility;
