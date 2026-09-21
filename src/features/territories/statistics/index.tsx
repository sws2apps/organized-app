import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { Badge, Button, Typography } from '@components/index';
import { useAtomValue } from 'jotai';
import { territoriesState } from '@states/territories';
import {
  averageDuration,
  completionCounts,
  coverageRate,
  durationBuckets,
  trimEmptyBands,
  gapBuckets,
  inProgressPerMonth,
  medianDuration,
  reviewNeededCount,
  totalDoNotCalls,
} from '../helpers';
import { MONTHS } from '@definition/territory';
import { ChartCard, ColumnChart, Gauge, StatRow } from '../components/charts';
import PublisherLoad from '../components/publisher_load';
import AttentionCard from './attention_card';
import CoverageGrid from './coverage_grid';
import { PublisherSplit, PublisherTrend } from './publisher_cards';
import CoverageCycleCard from './coverage_cycle_card';

const TerritoriesStatistics = () => {
  const navigate = useNavigate();

  const territories = useAtomValue(territoriesState);

  const rate = coverageRate(territories);
  const buckets = trimEmptyBands(durationBuckets(territories));
  const maxBucket = Math.max(...buckets.map((bucket) => bucket.value), 1);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'minmax(0, 1fr)',
          tablet600: 'repeat(12, minmax(0, 1fr))',
        },
        gap: '16px',
        alignItems: 'stretch',
      }}
    >
      <ChartCard
        title="Coverage"
        hint="Territories covered at least once this service year"
        span={4}
      >
        <Gauge value={rate} label="Covered" />

        <Stack spacing="14px">
          {completionCounts(territories).map((entry) => (
            <StatRow
              key={entry.label}
              label={entry.label}
              value={entry.value}
              max={territories.length}
              color={entry.color}
            />
          ))}
        </Stack>
      </ChartCard>

      <ChartCard
        title="Time to cover a territory"
        hint={`Median: ${medianDuration(territories)} months · average: ${averageDuration(territories)} months`}
        span={4}
      >
        <Stack spacing="12px">
          {buckets.map((bucket) => (
            <StatRow
              key={bucket.label}
              label={bucket.label}
              value={bucket.value}
              max={maxBucket}
            />
          ))}
        </Stack>
      </ChartCard>

      <ChartCard
        title="Territories in work"
        hint="How many were being worked in each month"
        span={4}
      >
        <ColumnChart values={inProgressPerMonth(territories)} labels={MONTHS} />
      </ChartCard>

      <CoverageCycleCard buckets={gapBuckets(territories)} />

      <ChartCard title="Publishers" hint="Most territories held" span={4}>
        <PublisherLoad territories={territories} limit={9} />
      </ChartCard>

      <ChartCard title="Do not calls" span={4}>
        <Stack
          direction="row"
          spacing="12px"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing="10px" sx={{ alignItems: 'baseline' }}>
            <Typography className="big-numbers" color="var(--black)">
              {totalDoNotCalls(territories)}
            </Typography>
            <Box sx={{ width: 'fit-content' }}>
              <Badge
                size="small"
                filled={false}
                color="orange"
                text={`Review needed: ${reviewNeededCount(territories)}`}
              />
            </Box>
          </Stack>

          <Button
            variant="small"
            disableAutoStretch
            onClick={(() => navigate('/territories/do-not-calls')) as never}
            sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
          >
            See all
          </Button>
        </Stack>

        <Stack spacing="12px">
          {[...territories]
            .sort((a, b) => b.doNotCalls.length - a.doNotCalls.length)
            .slice(0, 5)
            .map((territory) => (
              <StatRow
                key={territory.id}
                label={`${territory.number} · ${territory.name}`}
                value={territory.doNotCalls.length}
                max={Math.max(
                  ...territories.map((item) => item.doNotCalls.length),
                  1
                )}
              />
            ))}
        </Stack>
      </ChartCard>
      <CoverageGrid territories={territories} years={[2026, 2025, 2024]} />

      <PublisherSplit territories={territories} />

      <PublisherTrend territories={territories} />

      <AttentionCard territories={territories} />
    </Box>
  );
};

export default TerritoriesStatistics;
