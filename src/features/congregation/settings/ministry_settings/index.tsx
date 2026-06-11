import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { Stack } from '@mui/material';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import SpecialMonths from './special_months';
import PublishersSort from '../congregation_privacy/publishers_sort';

const MinistrySettings = () => {
  const { t } = useAppTranslation();
  const { isGroup } = useCurrentUser();

  return (
    <Stack spacing="16px">
      <CardSection>
        <CardSectionHeader title={t('tr_specialMonths')} description={t('tr_specialMonthsDesc')} />
        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
          <SpecialMonths />
        </CardSectionContent>
      </CardSection>

      {!isGroup && (
        <CardSection>
          <CardSectionHeader title={t('tr_fieldServiceGroups')} />
          <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
            <PublishersSort />
          </CardSectionContent>
        </CardSection>
      )}
    </Stack>
  );
};

export default MinistrySettings;
