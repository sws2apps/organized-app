import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { publisherCoverage, publishersPerMonth, serviceYear } from '../helpers';
import { ChartCard, ColumnChart } from '../components/charts';
import { Territory } from '@definition/territory';
import { territoryMonthsState } from '@states/territories';

export const PublisherSplit = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const { withTerritory, without, never } = publisherCoverage(territories);

  const total = withTerritory + without + never || 1;
  const share = Math.round((withTerritory / total) * 100);

  const rows = [
    {
      label: 'With territory',
      tooltip: 'with a territory',
      value: withTerritory,
      color: 'var(--accent-main)',
    },
    {
      label: 'Without territory',
      tooltip: 'without one now',
      value: without,
      color: 'var(--accent-300)',
    },
    {
      label: 'Never had a territory',
      tooltip: 'never had a territory',
      value: never,
      color: 'var(--orange-main)',
    },
  ];

  return (
    <ChartCard
      title="Publishers with a territory"
      hint={`${share}% of publishers and groups hold at least one`}
      span={4}
    >
      <Stack direction="row" spacing="4px" sx={{ height: '20px' }}>
        {rows.map((row) => (
          <Tooltip key={row.label} title={`${row.value} ${row.tooltip}`}>
            <Box
              sx={{
                flexGrow: row.value || 0.02,
                borderRadius: 'var(--radius-s)',
                backgroundColor: row.color,
              }}
            />
          </Tooltip>
        ))}
      </Stack>

      <Stack spacing="8px">
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            spacing="8px"
            sx={{ alignItems: 'center' }}
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
              {row.label}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography className="body-small-semibold" color="var(--black)">
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </ChartCard>
  );
};

export const PublisherTrend = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const months = useAtomValue(territoryMonthsState);

  const year = serviceYear() - 1;

  const values = publishersPerMonth(territories, year);

  return (
    <ChartCard
      title="Publishers holding a territory"
      hint={`Each month of the ${year} service year`}
      span={8}
    >
      <ColumnChart values={values} labels={months} />
    </ChartCard>
  );
};
