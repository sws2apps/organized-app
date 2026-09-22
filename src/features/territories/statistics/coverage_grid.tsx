import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { coverageGrid } from '../helpers';
import { ChartCard } from '../components/charts';
import { Territory } from '@definition/territory';
import { territoryMonthsState } from '@states/territories';

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

  return (
    <ChartCard
      title="Territories covered each month"
      hint="A territory counts in the month it came back · service year runs September to August"
      span={12}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: '640px' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '64px repeat(12, minmax(0, 1fr)) 56px',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            <Box />
            {months.map((month) => (
              <Typography
                key={month}
                className="label-small-regular"
                color="var(--grey-350)"
                sx={{ textAlign: 'center' }}
              >
                {month}
              </Typography>
            ))}
            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              sx={{ textAlign: 'right' }}
            >
              Total
            </Typography>

            {rows.map((row) => (
              <Box key={row.year} sx={{ display: 'contents' }}>
                <Typography
                  className="body-small-semibold"
                  color="var(--black)"
                >
                  {row.year}
                </Typography>

                {row.months.map((value, month) => (
                  <Tooltip
                    key={month}
                    title={`${value} covered in ${months[month]} ${row.year}`}
                  >
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
                        color={
                          value / max > 0.55
                            ? 'var(--always-white)'
                            : 'var(--black)'
                        }
                      >
                        {value || ''}
                      </Typography>
                    </Box>
                  </Tooltip>
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
      </Box>

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
