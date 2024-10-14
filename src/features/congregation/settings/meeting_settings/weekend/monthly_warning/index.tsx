import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useWeekendSettings from './useMonthlyWarning';
import SwitchWithLabel from '@components/switch_with_label';

const MonthlyWarning = () => {
  const { t } = useAppTranslation();

  const { isWeekendEditor, isPublicTalkCoordinator } = useCurrentUser();

  const { handleMonthlyOverlapToggle, monthlyOverlapShown } =
    useWeekendSettings();

  return (
    <SwitchWithLabel
      label={t('tr_repeatedMonthlyWarning')}
      helper={t('tr_repeatedMonthlyWarningDesc')}
      checked={monthlyOverlapShown}
      onChange={handleMonthlyOverlapToggle}
      readOnly={!isWeekendEditor && !isPublicTalkCoordinator}
    />
  );
};

export default MonthlyWarning;
