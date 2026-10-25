import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Typography } from '@components/index';
import {
  chartsCut,
  publisherCoverage,
  PublisherSort,
  publishersPerMonth,
  rangeMonths,
  StatsRange,
} from '@features/territories/helpers';
import { territoryAssigneesState } from '@features/territories/assignees';
import { cardsOut } from '@features/territories/card_filter';
import {
  ChartCard,
  ColumnChart,
} from '@features/territories/components/charts';
import PublisherLoad, {
  PublisherSortButton,
} from '@features/territories/components/publisher_load';
import { Territory } from '@definition/territory';
import { monthShortNamesState } from '@states/app';

export const PublisherSplit = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const { t } = useAppTranslation();

  const assignees = useAtomValue(territoryAssigneesState);
  const { withTerritory, without, never } = publisherCoverage(
    territories,
    assignees
  );

  const [open, setOpen] = useState<string>();
  const [sort, setSort] = useState<PublisherSort>('count');

  const total = withTerritory.length + without.length + never.length || 1;
  const share = Math.round((withTerritory.length / total) * 100);

  const rows = [
    {
      label: 'tr_withTerritory',
      tooltip: 'tr_territoryWithATerritory',
      entries: withTerritory,
      color: 'var(--accent-main)',
    },
    {
      label: 'tr_withoutTerritory',
      tooltip: 'tr_territoryWithoutOneNow',
      entries: without,
      color: 'var(--accent-300)',
    },
    {
      label: 'tr_territoryNeverHadATerritory',
      tooltip: 'tr_territoryNeverAssignedCount',
      entries: never,
      color: 'var(--orange-main)',
    },
  ].map((row) => ({ ...row, value: row.entries.length }));

  const opened = rows.find((row) => row.label === open);
  const out = cardsOut(territories);

  return (
    <ChartCard
      title={t('tr_territoryPublishersWithATerritory')}
      hint={t('tr_territoryOfPublishersAndGroupsHoldAtLeastOne', {
        share,
      })}
      note={t('tr_territoryAsOfToday')}
      span={4}
      action={opened && <PublisherSortButton sort={sort} onChange={setSort} />}
    >
      <Stack direction="row" spacing="4px" sx={{ height: '20px' }}>
        {rows.map((row) => (
          // a plain title: the Tooltip's wrapper box would swallow the flexGrow
          <Box
            key={row.label}
            title={t(row.tooltip, { n: row.value })}
            sx={{
              flexGrow: row.value || 0.02,
              borderRadius: 'var(--radius-s)',
              backgroundColor: row.color,
            }}
          />
        ))}
      </Stack>

      <Stack spacing="2px">
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            spacing="8px"
            onClick={() => setOpen(open === row.label ? undefined : row.label)}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 8px',
              margin: '0 -8px',
              borderRadius: 'var(--radius-m)',
              transition: 'background-color 0.15s ease',
              backgroundColor:
                open === row.label ? 'var(--accent-150)' : undefined,
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: 'var(--radius-max)',
                backgroundColor: row.color,
              }}
            />
            <Typography className="body-small-regular" color="var(--black)">
              {t(row.label)}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography className="body-small-semibold" color="var(--black)">
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {out.printed + out.digital > 0 && (
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t('tr_territoryOutPrintedDigital', out)}
        </Typography>
      )}

      {opened && (
        <PublisherLoad
          key={opened.label}
          entries={opened.entries}
          sort={sort}
        />
      )}
    </ChartCard>
  );
};

export const PublisherLoadCard = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const { t } = useAppTranslation();

  const assignees = useAtomValue(territoryAssigneesState);
  const [sort, setSort] = useState<PublisherSort>('count');

  return (
    <ChartCard
      title={t('tr_publishers')}
      hint={
        sort === 'count'
          ? t('tr_territoryMostTerritoriesHeld')
          : t('tr_territoryTerritoriesHeldByName')
      }
      note={t('tr_territoryAsOfToday')}
      span={4}
      action={<PublisherSortButton sort={sort} onChange={setSort} />}
    >
      <PublisherLoad
        entries={publisherCoverage(territories, assignees).withTerritory}
        sort={sort}
        limit={9}
      />
    </ChartCard>
  );
};

export const PublisherTrend = ({
  territories,
  range,
}: {
  territories: Territory[];
  range: StatsRange;
}) => {
  const { t } = useAppTranslation();

  const monthNames = useAtomValue(monthShortNamesState);

  const calendarMonths = rangeMonths(range);
  const months = calendarMonths.map(({ month }) => monthNames[month]);
  const monthIds = calendarMonths.map(({ year, month }) => `${year}-${month}`);
  const values = publishersPerMonth(territories, range);

  return (
    <ChartCard
      title={t('tr_territoryPublishersHoldingATerritory')}
      hint={
        chartsCut(range)
          ? t('tr_territoryEachOfTheLast24MonthsOfThePeriod')
          : t('tr_territoryEachMonthOfThePeriod')
      }
      span={8}
    >
      <ColumnChart values={values} labels={months} monthIds={monthIds} />
    </ChartCard>
  );
};
