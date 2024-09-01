import { useAppTranslation } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import SpecialMonths from './special_months';

const MinistrySettings = () => {
  const { t } = useAppTranslation();

  return (
    <CardSection>
      <CardSectionHeader title={t('tr_ministry')} />

      <CardSectionContent>
        <SpecialMonths />
      </CardSectionContent>
    </CardSection>
  );
};

export default MinistrySettings;
