import { Box } from '@mui/material';
import { TabLabelProps } from './index.types';
import Typography from '@components/typography';

const TabLabel = ({ label, selected }: TabLabelProps) => {
  return (
    <Box sx={{ display: 'grid', '& > *': { gridArea: '1 / 1' } }}>
      <Typography
        className="h4"
        color="inherit"
        aria-hidden={!selected}
        sx={{ visibility: selected ? 'visible' : 'hidden' }}
      >
        {label}
      </Typography>

      <Typography
        className="body-regular"
        color="inherit"
        aria-hidden={selected}
        sx={{ visibility: selected ? 'hidden' : 'visible' }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default TabLabel;
