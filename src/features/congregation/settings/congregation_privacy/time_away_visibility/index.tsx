import SwitchWithLabel from '@components/switch_with_label';
import useAppTranslation from '@hooks/useAppTranslation';
import useCurrentUser from '@hooks/useCurrentUser';
import useTimeAwayVisibility from './useTimeAwayVisibility';

const TimeAwayVisibility = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { timeAwayPublic, handleTimeAwayPublicToggle } =
    useTimeAwayVisibility();

  return (
    <SwitchWithLabel
      label={t('tr_showAwayToAll')}
      helper={t('tr_showAwayToAllDesc')}
      checked={timeAwayPublic}
      onChange={handleTimeAwayPublicToggle}
      readOnly={!isAdmin}
    />
  );
};

export default TimeAwayVisibility;
