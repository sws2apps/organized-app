import { useAppTranslation } from '@hooks/index';
import useAssignmentPreferences from './useAssignmentPreferences';
import SwitchWithLabel from '@components/switch_with_label';

const AssignmentPreferences = () => {
  const { t } = useAppTranslation();

  const {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    autoAssignClosingPrayer,
    handleAutoClosingPrayerToggle,
  } = useAssignmentPreferences();

  return (
    <>
      <SwitchWithLabel
        label={t('tr_autoAssignOpeningPrayer')}
        checked={autoAssignOpeningPrayer}
        onChange={handleAutoOpeningPrayerToggle}
      />

      <SwitchWithLabel
        label={t('tr_autoAssignClosingPrayer')}
        checked={autoAssignClosingPrayer}
        onChange={handleAutoClosingPrayerToggle}
      />
    </>
  );
};

export default AssignmentPreferences;
