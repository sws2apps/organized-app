import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { ChartCard } from '../components/charts';
import { CoveredBadge, StatusBadge } from '../components/territory_badges';
import TruncatedText from '../components/truncated_text';
import { Territory } from '@definition/territory';

const AttentionCard = ({ territories }: { territories: Territory[] }) => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(10);

  const rows = [...territories]
    .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered)
    .slice(0, limit);

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
          gridTemplateColumns: {
            mobile: 'minmax(0, 1fr)',
            laptop: 'repeat(2, minmax(0, 1fr))',
          },
          columnGap: '24px',
        }}
      >
        {rows.map((territory, index) => (
          <Stack
            key={territory.id}
            direction="row"
            spacing="12px"
            onClick={() => navigate(`/territories/${territory.id}`)}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px 8px',
              borderRadius: 'var(--radius-m)',
              borderTop: index < 2 ? 'none' : '1px solid var(--accent-200)',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              sx={{ width: '20px', flexShrink: 0 }}
            >
              {index + 1}
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
      </Box>

      {territories.length > limit && (
        <Box
          onClick={() => setLimit(limit + 10)}
          sx={{ cursor: 'pointer', width: 'fit-content' }}
        >
          <Typography
            className="body-small-semibold"
            color="var(--accent-main)"
          >
            Show more
          </Typography>
        </Box>
      )}
    </ChartCard>
  );
};

export default AttentionCard;
