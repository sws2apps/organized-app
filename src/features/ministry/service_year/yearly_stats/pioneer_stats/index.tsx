import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { PioneerStatsProps } from './index.types';
import usePioneerStats from './usePioneerStats';
import Divider from '@components/divider';
import LabelRow from '../label_row';
import Typography from '@components/typography';
import { IconInfo } from '@components/icons';

const PioneerStats = ({ year }: PioneerStatsProps) => {
  const { t } = useAppTranslation();

  const { goal, hours_left, isCurrentSY, hours_balance, monthly_goal, isInfirm } =
    usePioneerStats(year);

  if (isInfirm) {
    return (
      <Stack spacing="16px" padding="8px 0">
        <Typography className="h3">{t('tr_pioneerServiceStats')}</Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconInfo color="var(--grey-350)" />
          <Typography className="body-small-regular" color="var(--grey-350)">
            {t('tr_infirmPioneerNoGoal')}
          </Typography>
        </Box>
      </Stack>
    );
  }

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
          <LabelRow name={t('tr_currentMonthlyGoal')} value={monthly_goal} />
        )}

        {isCurrentSY && (
          <LabelRow name={t('tr_hoursBalance')} value={hours_balance} />
        )}
      </Stack>
    </Stack>
  );
};

export default PioneerStats;
