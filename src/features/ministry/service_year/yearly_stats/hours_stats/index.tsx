import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { HoursStatsProps } from './index.types';
import useHoursStats from './useHoursStats';
import Divider from '@components/divider';
import LabelRow from '../label_row';

const HoursStats = ({ year }: HoursStatsProps) => {
  const { t } = useAppTranslation();

  const { isFR, hours } = useHoursStats(year);

  return (
    <Stack spacing="8px" divider={<Divider color="var(--accent-200)" />}>
      <Stack
        spacing="8px"
        divider={<Divider dashed color="var(--accent-200)" />}
      >
        <LabelRow
          name={t('tr_totalHours')}
          value={hours.total}
          className="h3"
        />

        {hours.credit > 0 && (
          <>
            <LabelRow
              name={t('tr_fieldMinistry')}
              value={hours.field}
              color="var(--grey-350)"
            />
            <LabelRow
              name={t('tr_creditHours')}
              value={hours.credit}
              color="var(--grey-350)"
              sx={{ marginBottom: '8px !important' }}
            />
          </>
        )}
      </Stack>

      {isFR && (
        <LabelRow name={t('tr_averageMonthlyHours')} value={hours.average} />
      )}
    </Stack>
  );
};

export default HoursStats;
