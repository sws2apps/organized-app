import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionHeader } from '../shared_styles';
import HallCleaningSettingsBody from './settings_body';

const HallCleaningSettings = () => {
  const { t } = useAppTranslation();

  return (
    <CardSection>
      <CardSectionHeader title={t('tr_hallCleaning')} />

      <HallCleaningSettingsBody />
    </CardSection>
  );
};

export default HallCleaningSettings;
