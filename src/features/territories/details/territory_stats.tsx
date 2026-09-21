import { Box } from '@mui/material';
import { Typography } from '@components/index';
import { daysLabel } from '../helpers';
import { Territory } from '@definition/territory';

const TerritoryStats = ({ territory }: { territory: Territory }) => {
  const months = territory.assignments.map((assignment) => assignment.months);

  const average = months.length
    ? Math.round(months.reduce((acc, value) => acc + value, 0) / months.length)
    : 0;

  const stats = [
    {
      id: 'covered',
      label: 'Last covered',
      value: daysLabel(territory.daysSinceCovered),
    },
    {
      id: 'households',
      label: 'Households',
      value: String(territory.households),
    },
    average && {
      id: 'duration',
      label: 'Usual duration',
      value: `${average} mo`,
    },
    territory.doNotCalls.length > 0 && {
      id: 'dnc',
      label: 'Do not calls',
      value: String(territory.doNotCalls.length),
    },
  ].filter(Boolean) as { id: string; label: string; value: string }[];

  if (stats.length < 3) {
    stats.push({
      id: 'dnc',
      label: 'Do not calls',
      value: String(territory.doNotCalls.length),
    });
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '8px',
      }}
    >
      {stats.map((stat) => (
        <Box
          key={stat.id}
          sx={{
            padding: '12px',
            backgroundColor: 'var(--accent-150)',
            borderRadius: 'var(--radius-l)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0,
          }}
        >
          <Typography className="label-small-regular" color="var(--accent-400)">
            {stat.label}
          </Typography>
          <Typography className="body-small-semibold">{stat.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TerritoryStats;
