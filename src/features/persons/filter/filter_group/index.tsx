import { Box } from '@mui/material';
import Typography from '@components/typography';
import FilterChip from '@components/filter_chip';
import { FilterGroupType } from './index.types';
import useFilterGroup from './useFilterGroup';

const FilterGroup = ({ group }: FilterGroupType) => {
  const { filtersKey, handleClick } = useFilterGroup();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography className="body-small-semibold" color="var(--grey-350)">
        {group.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {group.items.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.name}
            selected={filtersKey.includes(filter.id)}
            onClick={() => handleClick(filter.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FilterGroup;
