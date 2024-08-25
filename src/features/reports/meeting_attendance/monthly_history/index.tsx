import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CardContainer } from '../shared_styles';
import useMonthlyHistory from './useMonthlyHistory';
import MonthItem from './month_item';
import Typography from '@components/typography';
import YearSelector from './year_selector';

const MonthlyHistory = () => {
  const { t } = useAppTranslation();

  const { handleTabChange, value, months } = useMonthlyHistory();

  return (
    <CardContainer sx={{ flex: 0.8 }}>
      <Stack spacing="16px">
        <Stack spacing="8px">
          <Typography className="h2">{t('tr_monthlyHistory')}</Typography>
          <Typography color="var(--grey-400)">{t('tr_recordS88')}</Typography>
        </Stack>

        <YearSelector value={value} onChange={handleTabChange} />

        {months.map((record) => (
          <MonthItem key={record.value} data={record} />
        ))}
      </Stack>
    </CardContainer>
  );
};

export default MonthlyHistory;
