import { Box } from '@mui/material';
import { daysLabel } from '../helpers';
import StatTile from '../components/stat_tile';
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
      label: 'Do not call',
      value: String(territory.doNotCalls.length),
    },
  ].filter(Boolean) as { id: string; label: string; value: string }[];

  if (stats.length < 3) {
    stats.push({
      id: 'dnc',
      label: 'Do not call',
      value: String(territory.doNotCalls.length),
    });
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: '8px',
        gridTemplateColumns: {
          mobile: 'repeat(2, minmax(0, 1fr))',
          tablet688: `repeat(${stats.length}, minmax(0, 1fr))`,
        },
        '& > :last-of-type:nth-of-type(odd)': {
          gridColumn: { mobile: 'span 2', tablet688: 'auto' },
        },
      }}
    >
      {stats.map((stat) => (
        <StatTile key={stat.id} label={stat.label} value={stat.value} />
      ))}
    </Box>
  );
};

export default TerritoryStats;
