import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import RecurringTimes from './recurring_times';

/**
 * Congregation settings card for field service meeting preferences.
 * Currently holds the per-group recurring meeting times — the same editor that
 * appears in the page's quick settings.
 */
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
