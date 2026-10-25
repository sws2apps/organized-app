import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { Button, Select, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { appLocaleState, monthShortNamesState } from '@states/app';
import { territoriesWithStatusState } from '@states/territories';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { currentCampaign } from '@features/territories/campaign_filter';
import {
  averageDuration,
  chartsCut,
  completionCounts,
  coverageRate,
  durationBuckets,
  trimEmptyBands,
  gapBuckets,
  serviceYear,
  inProgressPerMonth,
  periodWindow,
  rangeMonths,
  StatsRange,
  STATS_PERIODS,
  medianDuration,
  doNotCallAges,
} from '@features/territories/helpers';
import {
  ChartCard,
  ColumnChart,
  Gauge,
  StatRow,
} from '@features/territories/components/charts';
import StatTile from '@features/territories/components/stat_tile';
import AttentionCard from '@features/territories/statistics/attention_card';
import CoverageGrid from '@features/territories/statistics/coverage_grid';
import {
  PublisherLoadCard,
  PublisherSplit,
  PublisherTrend,
} from '@features/territories/statistics/publisher_cards';
import CoverageCycleCard from '@features/territories/statistics/coverage_cycle_card';
import CampaignCard from '@features/territories/statistics/campaign_card';

const dayStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayEnd = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

// a service year that has just begun has nothing to show yet
const defaultPeriod = () => {
  const month = new Date().getMonth();
  return month === 8 || month === 9 ? `sy${serviceYear() - 1}` : 'last12';
};

const TerritoriesStatistics = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const territories = useAtomValue(territoriesWithStatusState);
  const monthNames = useAtomValue(monthShortNamesState);
  const campaigns = useAtomValue(territoryCampaignsState);

  const locale = useAtomValue(appLocaleState);

  const [period, setPeriod] = useState(defaultPeriod);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  // the last complete From–To, kept on screen while a date is being fixed
  const [customRange, setCustomRange] = useState<StatsRange>();

  const current = serviceYear();
  const today = dayStart(new Date());
  const custom = period === 'custom';
  const range: StatsRange =
    (custom ? customRange : periodWindow(period)) ??
    periodWindow(defaultPeriod())!;
  const calendarMonths = rangeMonths(range);
  const months = calendarMonths.map(({ month }) => monthNames[month]);
  const monthIds = calendarMonths.map(({ year, month }) => `${year}-${month}`);

  const fromError =
    custom && (!from || !Number.isFinite(from.getTime()))
      ? t('tr_territoryPickADate')
      : '';
  let toError = '';
  if (custom) {
    if (!to || !Number.isFinite(to.getTime()))
      toError = t('tr_territoryPickADate');
    else if (to > today) toError = t('tr_territoryThisDateIsInTheFuture');
    else if (from && from > to) toError = t('tr_territoryBeforeTheStartDate');
  }

  const rangeText = `${format(range.start, 'PP', { locale })} – ${format(
    range.end,
    'PP',
    { locale }
  )}`;

  // starts from the period on screen, so nothing jumps until a date changes
  const choosePeriod = (next: string) => {
    if (next === 'custom') {
      const start = dayStart(range.start);
      const end = range.end > today ? today : dayStart(range.end);

      setFrom(start);
      setTo(end);
      setCustomRange({ start, end: dayEnd(end) });
    }

    setPeriod(next);
  };

  const changeCustom = (nextFrom: Date | null, nextTo: Date | null) => {
    const start = nextFrom && dayStart(nextFrom);
    const end = nextTo && dayStart(nextTo);

    setFrom(start);
    setTo(end);

    if (start && end && start <= end && end <= today) {
      setCustomRange({ start, end: dayEnd(end) });
    }
  };

  const rate = coverageRate(territories, range);
  const ages = doNotCallAges(territories, range);
  const buckets = trimEmptyBands(durationBuckets(territories, range));
  const maxBucket = Math.max(...buckets.map((bucket) => bucket.value), 1);

  // first while a campaign runs or has just ended, otherwise down with the rest
  const campaignCard = <CampaignCard territories={territories} />;
  const campaignFirst = !!currentCampaign(campaigns);

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
      <Box
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <Box sx={{ width: { mobile: '100%', tablet600: '280px' } }}>
          <Select
            label={t('tr_period')}
            value={period}
            onChange={(event) => choosePeriod(String(event.target.value))}
          >
            {STATS_PERIODS().map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Typography className="body-regular">{option.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
        {custom && (
          // side by side even on a phone: two halves of one range
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              flex: { mobile: '1 1 100%', tablet600: '0 1 456px' },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <DatePicker
                label={t('tr_territoryFrom')}
                value={from}
                maxDate={to ?? today}
                error={!!fromError}
                helperText={fromError}
                onChange={(value) => changeCustom(value, to)}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <DatePicker
                label={t('tr_territoryTo')}
                value={to}
                minDate={from}
                maxDate={today}
                error={!!toError}
                helperText={toError}
                onChange={(value) => changeCustom(from, value)}
              />
            </Box>
          </Box>
        )}
        {/* a complete From–To already says it */}
        {(!custom || fromError || toError) && (
          <Box
            sx={{
              minHeight: { tablet600: '48px' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography className="body-small-regular" color="var(--grey-400)">
              {custom
                ? t('tr_territoryStillShowing', { range: rangeText })
                : rangeText}
            </Typography>
          </Box>
        )}
      </Box>

      {campaignFirst && campaignCard}

      <ChartCard
        title={t('tr_territoryCoverage')}
        hint={t('tr_territoryTerritoriesCoveredAtLeastOnceInThisPeriod')}
        span={4}
      >
        <Gauge
          value={rate.rate}
          label={t('tr_territoryOfCovered', {
            covered: rate.covered,
            total: rate.total,
          })}
        />

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
        title={t('tr_territoryTimeToCoverATerritory')}
        hint={t('tr_territoryMedianMonthsAverageMonths', {
          median: medianDuration(territories, range),
          average: averageDuration(territories, range),
        })}
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
        title={t('tr_territoryTerritoriesInWork')}
        hint={
          chartsCut(range)
            ? t('tr_territoryHowManyWereBeingWorkedInEachOfThe')
            : t('tr_territoryHowManyWereBeingWorkedInEachMonthOf')
        }
        span={4}
      >
        <ColumnChart
          values={inProgressPerMonth(territories, range)}
          labels={months}
          monthIds={monthIds}
        />
      </ChartCard>

      <CoverageCycleCard buckets={gapBuckets(territories, range)} />

      <PublisherLoadCard territories={territories} />

      <ChartCard
        title={t('tr_territoryDoNotCallLabel')}
        hint={t('tr_territoryAddedCountsTheChosenPeriod')}
        span={4}
        action={
          <Button
            variant="small"
            disableAutoStretch
            minHeight={32}
            onClick={() =>
              navigate('/territories/do-not-calls', {
                state: { parent: 'tr_territoryTerritoryCoverageStatistics' },
              })
            }
          >
            {t('tr_territorySeeAll')}
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
          <StatTile
            label={t('tr_territoryOlderThan2Years')}
            value={String(ages.old)}
          />
          <StatTile label={t('tr_territoryAdded')} value={String(ages.added)} />
          <StatTile label={t('tr_total')} value={String(ages.total)} />
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

      <PublisherTrend territories={territories} range={range} />

      {!campaignFirst && campaignCard}

      <AttentionCard territories={territories} />
    </Box>
  );
};

export default TerritoriesStatistics;
