import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { publisherCoverage, publishersPerMonth, serviceYear } from '../helpers';
import { ChartCard, ColumnChart } from '../components/charts';
import { MONTHS, Territory } from '@definition/territory';

export const PublisherSplit = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const { withTerritory, without } = publisherCoverage(territories);

  const total = withTerritory + without || 1;
  const share = Math.round((withTerritory / total) * 100);

  return (
    <ChartCard
      title="Publishers with a territory"
      hint={`${share}% of publishers and groups hold at least one`}
      span={4}
    >
      <Stack direction="row" spacing="4px" sx={{ height: '20px' }}>
        <Tooltip title={`${withTerritory} with a territory`}>
          <Box
            sx={{
              flexGrow: withTerritory || 0.02,
              borderRadius: 'var(--radius-s)',
              backgroundColor: 'var(--accent-main)',
            }}
          />
        </Tooltip>
        <Tooltip title={`${without} without a territory`}>
          <Box
            sx={{
              flexGrow: without || 0.02,
              borderRadius: 'var(--radius-s)',
              backgroundColor: 'var(--accent-200)',
            }}
          />
        </Tooltip>
      </Stack>

      <Stack spacing="8px">
        {[
          {
            label: 'With a territory',
            value: withTerritory,
            dot: 'var(--accent-main)',
          },
          { label: 'Without', value: without, dot: 'var(--accent-200)' },
        ].map((row) => (
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
                backgroundColor: row.dot,
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

// option B: how that share moved through the service year
export const PublisherTrend = ({
  territories,
}: {
  territories: Territory[];
}) => {
  const year = serviceYear() - 1;

  const values = publishersPerMonth(territories, year);

  return (
    <ChartCard
      title="Publishers holding a territory"
      hint={`Each month of the ${year} service year`}
      span={8}
    >
      <ColumnChart values={values} labels={MONTHS} />
    </ChartCard>
  );
};
