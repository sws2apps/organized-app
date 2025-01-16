import Typography from '@components/typography';
import { Box } from '@mui/material';
import { WeekBadgeType } from './index.types';

const WeekBadge = (props: WeekBadgeType) => {
  return (
    <Box
      sx={{
        flex: '1',
        height: '32px',
        padding: '6px 8px 6px 8px',
        gap: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-s)',
      }}
    >
      <Typography color={'var(--accent-dark)'} className="h4">
        {props.text}
      </Typography>
    </Box>
  );
};

export default WeekBadge;
