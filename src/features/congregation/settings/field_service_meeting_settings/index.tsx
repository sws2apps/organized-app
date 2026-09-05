import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import RecurringTimes from './recurring_times';

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
