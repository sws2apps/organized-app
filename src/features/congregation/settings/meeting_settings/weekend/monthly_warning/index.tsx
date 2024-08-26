import { useAppTranslation } from '@hooks/index';
import useWeekendSettings from './useMonthlyWarning';
import SwitchWithLabel from '@components/switch_with_label';

const MonthlyWarning = () => {
  const { t } = useAppTranslation();

  const { handleMonthlyOverlapToggle, monthlyOverlapShown } =
    useWeekendSettings();

  return (
    <SwitchWithLabel
      label={t('tr_repeatedMonthlyWarning')}
      helper={t('tr_repeatedMonthlyWarningDesc')}
      checked={monthlyOverlapShown}
      onChange={handleMonthlyOverlapToggle}
    />
  );
};

export default MonthlyWarning;
