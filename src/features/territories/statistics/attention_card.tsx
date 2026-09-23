import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBreakpoints } from '@hooks/index';
import { Box, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import { ChartCard } from '../components/charts';
import { CoveredBadge, StatusBadge } from '../components/territory_badges';
import TruncatedText from '../components/truncated_text';
import { Territory } from '@definition/territory';

const AttentionCard = ({ territories }: { territories: Territory[] }) => {
  const navigate = useNavigate();

  const { laptopUp } = useBreakpoints();

  const [limit, setLimit] = useState(10);

  const rows = [...territories]
    .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered)
    .slice(0, limit)
    .map((territory, index) => ({ territory, rank: index + 1 }));

  const half = Math.ceil(rows.length / 2);
  const columns = laptopUp ? [rows.slice(0, half), rows.slice(half)] : [rows];

  const overYear = territories.filter(
    (territory) => territory.daysSinceCovered > 365
  ).length;

  return (
    <ChartCard
      title="Waiting the longest"
      hint={`${overYear} of ${territories.length} territories have waited over a year`}
      span={12}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: laptopUp
            ? 'minmax(0, 1fr) auto minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
          columnGap: '16px',
          rowGap: '4px',
          alignItems: 'stretch',
        }}
      >
        {columns.map((column, columnIndex) => [
          columnIndex > 0 && (
            <CustomDivider
              key={`divider-${column[0]?.rank}`}
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
            />
          ),
          <Stack
            key={column[0]?.rank}
            spacing="4px"
            divider={<CustomDivider color="var(--accent-200)" />}
          >
            {column.map(({ territory, rank }) => (
              <Stack
                key={territory.id}
                direction="row"
                spacing="12px"
                onClick={() =>
                  navigate(`/territories/${territory.id}`, {
                    state: { parent: 'Territory coverage statistics' },
                  })
                }
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-m)',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { backgroundColor: 'var(--accent-100)' },
                }}
              >
                <Typography
                  className="label-small-regular"
                  color="var(--grey-350)"
                  sx={{ width: '20px', flexShrink: 0 }}
                >
                  {rank}
                </Typography>

                <Typography
                  className="body-small-semibold"
                  color="var(--black)"
                  sx={{ width: '48px', flexShrink: 0 }}
                >
                  {territory.number}
                </Typography>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <TruncatedText
                    className="body-small-regular"
                    color="var(--black)"
                    text={territory.name}
                  />
                  <TruncatedText
                    className="label-small-regular"
                    color="var(--grey-350)"
                    text={`${territory.city} · ${territory.households} households`}
                  />
                </Box>

                <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
                  <StatusBadge status={territory.status} />
                </Box>

                <CoveredBadge days={territory.daysSinceCovered} />
              </Stack>
            ))}
          </Stack>,
        ])}
      </Box>

      {territories.length > limit && (
        <Button
          variant="small"
          disableAutoStretch
          onClick={() => setLimit(limit + 10)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Show more
        </Button>
      )}
    </ChartCard>
  );
};

export default AttentionCard;
