import { useAppTranslation } from '@hooks/index';
import { Box } from '@mui/material';
import { coveredText } from '@features/territories/helpers';
import StatTile from '@features/territories/components/stat_tile';
import { Territory } from '@definition/territory';

// the do-not-call count is the header badge's
const TerritoryStats = ({ territory }: { territory: Territory }) => {
  const { t } = useAppTranslation();

  const months = territory.assignments.map((assignment) => assignment.months);

  const average = months.length
    ? Math.round(months.reduce((acc, value) => acc + value, 0) / months.length)
    : 0;

  const stats = [
    {
      id: 'covered',
      label: t('tr_territoryLastCovered'),
      value: coveredText(territory),
    },
    {
      id: 'households',
      label: t('tr_territoryHouseholds'),
      value: String(territory.households),
    },
    average && {
      id: 'duration',
      label: t('tr_territoryUsualDuration'),
      value: t('tr_territoryMo', { n: average }),
    },
  ].filter(Boolean) as { id: string; label: string; value: string }[];

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
