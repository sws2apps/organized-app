import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import Typography from '@components/typography';

/**
 * Inline empty state shared by the day, week and month views.
 */
const ShiftsEmpty = ({ message }: { message: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <IconInfo color="var(--grey-350)" />
    <Typography className="body-small-regular" color="var(--grey-400)">
      {message}
    </Typography>
  </Box>
);

export default ShiftsEmpty;
