import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import usePublisherDetails from './usePublisherDetails';
import Card from '@components/card';
import PersonDetails from '@features/persons/person_details';
import TextField from '@components/textfield';
import DatePicker from '@components/date_picker';
import Indicator, { IndicatorRow } from '@components/indicator';

const PublisherDetails = () => {
  const { t } = useAppTranslation();

  const {
    person,
    month,
    birth_date_value,
    age,
    baptism_date_value,
    baptism_years,
    first_report,
    handleChangeFirstReport,
  } = usePublisherDetails();

  return (
    <Card sx={{ flex: 1, gap: '24px', width: '100%' }}>
      <PersonDetails className="h2" person={person!} month={month} />

      <IndicatorRow sx={{ gap: '16px 8px' }}>
        <TextField
          label={t('tr_dateOfBirth')}
          value={birth_date_value}
          slotProps={{ input: { readOnly: true } }}
        />
        <Indicator>{t('tr_userAge', { userAge: age })}</Indicator>

        {baptism_date_value.length > 0 && (
          <>
            <TextField
              label={t('tr_baptismDate')}
              value={baptism_date_value}
              slotProps={{ input: { readOnly: true } }}
            />
            <Indicator>
              {t('tr_yearsNumber', { yearsCount: baptism_years })}
            </Indicator>
          </>
        )}

        <Box sx={{ gridColumn: '1 / -1' }}>
          <DatePicker
            label={t('tr_firstReport')}
            value={first_report}
            maxDate={new Date()}
            onChange={handleChangeFirstReport}
          />
        </Box>
      </IndicatorRow>
    </Card>
  );
};

export default PublisherDetails;
