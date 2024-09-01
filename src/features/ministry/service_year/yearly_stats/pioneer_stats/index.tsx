import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { PioneerStatsProps } from './index.types';
import usePioneerStats from './usePioneerStats';
import Divider from '@components/divider';
import LabelRow from '../label_row';
import Typography from '@components/typography';

const PioneerStats = ({ year }: PioneerStatsProps) => {
  const { t } = useAppTranslation();

  const { goal, hours_left, isCurrentSY, current_hours, hours_balance } =
    usePioneerStats(year);

  return (
    <Stack spacing="16px" padding="8px 0">
      <Typography className="h3">{t('tr_pioneerServiceStats')}</Typography>

      <Stack
        spacing="8px"
        divider={<Divider dashed color="var(--accent-200)" />}
      >
        <LabelRow name={t('tr_goalForYear')} value={goal} />
        <LabelRow name={t('tr_hoursLeft')} value={hours_left} />

        {isCurrentSY && (
          <LabelRow name={t('tr_currentMonthlyGoal')} value={current_hours} />
        )}

        {isCurrentSY && (
          <LabelRow name={t('tr_hoursBalance')} value={hours_balance} />
        )}
      </Stack>
    </Stack>
  );
};

export default PioneerStats;
