import { Stack } from '@mui/material';
import { ChartCard, StatRow } from '../components/charts';
import { trimEmptyBands } from '../helpers';

const CoverageCycleCard = ({
  buckets,
}: {
  buckets: { label: string; value: number }[];
}) => {
  const rows = trimEmptyBands(buckets);
  const max = Math.max(...rows.map((bucket) => bucket.value), 1);

  return (
    <ChartCard
      title="Time between coverings"
      hint="Months a territory waits before it is worked again"
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
