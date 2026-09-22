import { Box } from '@mui/material';
import { Typography } from '@components/index';

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <Box
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
      {label}
    </Typography>
    <Typography className="body-small-semibold">{value}</Typography>
  </Box>
);

export default StatTile;
