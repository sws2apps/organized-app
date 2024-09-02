import { ListSubheader } from '@mui/material';
import { FilterItemProps } from './index.types';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const FilterItem = ({ filter }: FilterItemProps) => {
  return (
    <>
      <ListSubheader
        className="body-small-semibold"
        sx={{
          color: 'var(--accent-dark)',
          font: 'inherit',
          padding: '16px 16px 8px 16px',
        }}
      >
        {filter.group}
      </ListSubheader>
      {filter.options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          <Typography>{option.name}</Typography>
        </MenuItem>
      ))}
    </>
  );
};

export default FilterItem;
