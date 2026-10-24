import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '@features/congregation/settings/shared_styles';
import { useAppTranslation } from '@hooks/index';
import RecurringTimes from '@features/congregation/settings/field_service_meeting_settings/recurring_times';

/** Settings card holding the per-group recurring meeting times. */
const FieldServiceMeetingSettings = () => {
  const { t } = useAppTranslation();

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_recurringFieldServiceMeetingTimes')}
        description={t('tr_fieldServiceMeetingTimesDesc')}
      />

      <CardSectionContent spacing="16px">
        <RecurringTimes />
      </CardSectionContent>
    </CardSection>
  );
};

export default FieldServiceMeetingSettings;
