import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { coverageGrid } from '../helpers';
import { ChartCard } from '../components/charts';
import { Territory } from '@definition/territory';
import { territoryMonthsState } from '@states/territories';

const Cell = ({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) => (
  <Tooltip title={label}>
    <Box
      sx={{
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-s)',
        border: '1px solid var(--accent-200)',
        backgroundColor: value
          ? `color-mix(in srgb, var(--accent-main) ${Math.round(
              (value / max) * 70 + 12
            )}%, var(--white))`
          : 'var(--white)',
      }}
    >
      <Typography
        className="label-small-semibold"
        color={value / max > 0.55 ? 'var(--always-white)' : 'var(--black)'}
      >
        {value || ''}
      </Typography>
    </Box>
  </Tooltip>
);

const Label = ({
  children,
  align = 'center',
}: {
  children: string;
  align?: 'left' | 'center' | 'right';
}) => (
  <Typography
    className="label-small-regular"
    color="var(--grey-350)"
    sx={{ textAlign: align }}
  >
    {children}
  </Typography>
);

const CoverageGrid = ({
  territories,
  years,
}: {
  territories: Territory[];
  years: number[];
}) => {
  const months = useAtomValue(territoryMonthsState);

  const rows = coverageGrid(territories, years);

  const max = Math.max(...rows.flatMap((row) => row.months), 1);

  // twelve months across; on a phone the row scrolls sideways with the years pinned
  const grid = (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '56px repeat(12, minmax(36px, 1fr)) 48px',
          gap: '4px',
          alignItems: 'center',
          minWidth: '600px',
          '& .year': {
            position: 'sticky',
            left: 0,
            zIndex: 1,
            backgroundColor: 'var(--white)',
            // covers the gap, so passing cells don't peek out beside the year
            boxShadow: '4px 0 0 var(--white)',
          },
        }}
      >
        <Box className="year" sx={{ alignSelf: 'stretch' }} />
        {months.map((month) => (
          <Label key={month}>{month}</Label>
        ))}
        <Label align="right">Total</Label>

        {rows.map((row) => (
          <Box key={row.year} sx={{ display: 'contents' }}>
            <Box
              className="year"
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography className="body-small-semibold" color="var(--black)">
                {row.year}
              </Typography>
            </Box>

            {row.months.map((value, month) => (
              <Cell
                key={months[month]}
                value={value}
                max={max}
                label={`${value} covered in ${months[month]} ${row.year}`}
              />
            ))}

            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{ textAlign: 'right' }}
            >
              {row.total}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <ChartCard
      title="Territories covered each month"
      hint="A territory counts in the month it came back · service year runs September to August"
      span={12}
    >
      {grid}

      <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
        <Typography className="label-small-regular" color="var(--grey-350)">
          Less
        </Typography>
        {[0.15, 0.35, 0.55, 0.75, 1].map((step) => (
          <Box
            key={step}
            sx={{
              width: '20px',
              height: '12px',
              borderRadius: 'var(--radius-s)',
              border: '1px solid var(--accent-200)',
              backgroundColor: `color-mix(in srgb, var(--accent-main) ${Math.round(
                step * 82
              )}%, var(--white))`,
            }}
          />
        ))}
        <Typography className="label-small-regular" color="var(--grey-350)">
          More
        </Typography>
      </Stack>
    </ChartCard>
  );
};

export default CoverageGrid;
