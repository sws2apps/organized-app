import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { AssignmentPreferencesProps } from './index.types';
import useAssignmentPreferences from './useAssignmentPreferences';
import SwitchWithLabel from '@components/switch_with_label';

const AssignmentPreferences = ({
  quickSettings,
}: AssignmentPreferencesProps) => {
  const { t } = useAppTranslation();

  const { isWeekendEditor, isPublicTalkCoordinator } = useCurrentUser();

  const {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    handleSubstituteSpeakerToggle,
    substituteSpeakerEnabled,
  } = useAssignmentPreferences();

  return (
    <>
      {(!quickSettings || (quickSettings && isWeekendEditor)) && (
        <SwitchWithLabel
          label={t('tr_autoAssignOpeningPrayer')}
          checked={autoAssignOpeningPrayer}
          onChange={handleAutoOpeningPrayerToggle}
          readOnly={!isWeekendEditor}
        />
      )}

      {(!quickSettings || (quickSettings && isPublicTalkCoordinator)) && (
        <SwitchWithLabel
          label={t('tr_appointSubsisuteSpeaker')}
          checked={substituteSpeakerEnabled}
          onChange={handleSubstituteSpeakerToggle}
          readOnly={!isPublicTalkCoordinator}
        />
      )}
    </>
  );
};

export default AssignmentPreferences;
