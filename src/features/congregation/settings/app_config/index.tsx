import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionContent, CardSectionHeader } from '../shared_styles';
import DateFormat from '../meeting_forms/date_format';
import NameFormat from '../meeting_forms/name_format';
import FirstDayOfTheWeek from '../first_day_week';

const AppConfig = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="16px">
      <CardSection>
        <CardSectionHeader title={t('tr_appConfiguration')} />
        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
          <Stack spacing="16px">
            <NameFormat />
            <DateFormat />
            <FirstDayOfTheWeek />
          </Stack>
        </CardSectionContent>
      </CardSection>
    </Stack>
  );
};

export default AppConfig;
