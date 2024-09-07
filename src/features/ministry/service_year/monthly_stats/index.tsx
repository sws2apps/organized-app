import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CardContainer } from '@features/ministry/shared_styles';
import useMonthlyStats from './useMontlyStats';
import Divider from '@components/divider';
import MonthItem from './month_item';
import Typography from '@components/typography';

const MonthlyStats = () => {
  const { t } = useAppTranslation();

  const { monthsList, person } = useMonthlyStats();

  return (
    <CardContainer>
      <Typography className="h2">{t('tr_monthlyHistory')}</Typography>

      {monthsList.length > 0 && (
        <Stack spacing="8px" divider={<Divider color="var(--accent-200)" />}>
          {monthsList.map((record) => (
            <MonthItem
              key={record.value}
              person={person}
              month={record.value}
            />
          ))}
        </Stack>
      )}
    </CardContainer>
  );
};

export default MonthlyStats;
