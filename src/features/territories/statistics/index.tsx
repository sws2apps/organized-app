import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@components/index';
import { useAtomValue } from 'jotai';
import {
  territoriesWithStatusState,
  territoryMonthsState,
} from '@states/territories';
import {
  averageDuration,
  completionCounts,
  coverageRate,
  durationBuckets,
  trimEmptyBands,
  gapBuckets,
  serviceYear,
  inProgressPerMonth,
  medianDuration,
  doNotCallAges,
  periodWindow,
} from '../helpers';
import { ChartCard, ColumnChart, Gauge, StatRow } from '../components/charts';
import PublisherLoad from '../components/publisher_load';
import StatTile from '../components/stat_tile';
import TabSwitcher from '@components/tab_switcher';
import AttentionCard from './attention_card';
import CoverageGrid from './coverage_grid';
import { PublisherSplit, PublisherTrend } from './publisher_cards';
import CoverageCycleCard from './coverage_cycle_card';

const TerritoriesStatistics = () => {
  const navigate = useNavigate();

  const territories = useAtomValue(territoriesWithStatusState);
  const months = useAtomValue(territoryMonthsState);

  const current = serviceYear();

  // the circuit overseer looks at the last six months, so that's where the page opens
  const periods = [
    { value: 'last6', label: 'Last 6 months' },
    { value: 'last12', label: 'Last 12 months' },
    { value: `sy${current}`, label: `${current} service year` },
    { value: `sy${current - 1}`, label: `${current - 1} service year` },
  ];

  const [period, setPeriod] = useState('last6');
  const range = periodWindow(period) ?? { start: new Date(0), end: new Date() };
  const periodLabel =
    periods.find((item) => item.value === period)?.label ?? '';

  const rate = coverageRate(territories, range);
  const ages = doNotCallAges(territories, range);
  const buckets = trimEmptyBands(durationBuckets(territories, range));
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
      <Box sx={{ gridColumn: '1 / -1', overflowX: 'auto' }}>
        <TabSwitcher
          ariaLabel="Period"
          surface="light"
          value={period}
          onChange={setPeriod}
          options={periods}
          sx={{ minWidth: '560px', maxWidth: '720px' }}
        />
      </Box>

      <ChartCard
        title="Coverage"
        hint={`Territories returned as covered · ${periodLabel}`}
        span={4}
      >
        <Gauge value={rate} label="Covered" />

        <Stack spacing="12px">
          {completionCounts(territories, range).map((entry) => (
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
        hint={`Median: ${medianDuration(territories, range)} months · average: ${averageDuration(territories, range)} months · ${periodLabel}`}
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
        hint={`How many were being worked in each month of the ${current} service year`}
        span={4}
      >
        <ColumnChart values={inProgressPerMonth(territories)} labels={months} />
      </ChartCard>

      <CoverageCycleCard buckets={gapBuckets(territories)} />

      <ChartCard title="Publishers" hint="Most territories held" span={4}>
        <PublisherLoad territories={territories} limit={9} />
      </ChartCard>

      <ChartCard
        title="Do not call"
        hint={`Added counts ${periodLabel.toLowerCase()}`}
        span={4}
        action={
          <Button
            variant="small"
            disableAutoStretch
            minHeight={32}
            onClick={() =>
              navigate('/territories/do-not-calls', {
                state: { parent: 'Territory coverage statistics' },
              })
            }
          >
            See all
          </Button>
        }
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          <StatTile label="Older than 2 years" value={String(ages.old)} />
          <StatTile label="Added" value={String(ages.added)} />
          <StatTile label="Total" value={String(ages.total)} />
        </Box>

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
      <CoverageGrid
        territories={territories}
        years={[current, current - 1, current - 2]}
      />

      <PublisherSplit territories={territories} />

      <PublisherTrend territories={territories} />

      <AttentionCard territories={territories} />
    </Box>
  );
};

export default TerritoriesStatistics;
