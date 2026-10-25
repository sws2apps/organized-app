import { useAppTranslation } from '@hooks/index';
import { Stack } from '@mui/material';
import { ChartCard, StatRow } from '@features/territories/components/charts';
import { trimEmptyBands } from '@features/territories/helpers';

const CoverageCycleCard = ({
  buckets,
}: {
  buckets: { label: string; value: number }[];
}) => {
  const { t } = useAppTranslation();

  const rows = trimEmptyBands(buckets);
  const max = Math.max(...rows.map((bucket) => bucket.value), 1);

  return (
    <ChartCard
      title={t('tr_territoryTimeBetweenCoverings')}
      hint={t('tr_territoryMonthsATerritoryWaitsBeforeItIsWorkedAgain')}
      span={4}
    >
      <Stack spacing="12px">
        {rows.map((bucket) => (
          <StatRow
            key={bucket.label}
            label={bucket.label}
            value={bucket.value}
            max={max}
          />
        ))}
      </Stack>
    </ChartCard>
  );
};

export default CoverageCycleCard;
