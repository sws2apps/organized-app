import { useAppTranslation } from '@hooks/index';
import useAssignmentPreferences from './useAssignmentPreferences';
import SwitchWithLabel from '@components/switch_with_label';

const AssignmentPreferences = () => {
  const { t } = useAppTranslation();

  const {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    handleSubstituteSpeakerToggle,
    substituteSpeakerEnabled,
  } = useAssignmentPreferences();

  return (
    <>
      <SwitchWithLabel
        label={t('tr_autoAssignOpeningPrayer')}
        checked={autoAssignOpeningPrayer}
        onChange={handleAutoOpeningPrayerToggle}
      />

      <SwitchWithLabel
        label={t('tr_appointSubsisuteSpeaker')}
        checked={substituteSpeakerEnabled}
        onChange={handleSubstituteSpeakerToggle}
      />
    </>
  );
};

export default AssignmentPreferences;
