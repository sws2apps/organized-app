import { Box } from '@mui/material';
import { WeekItemType } from './index.types';
import useWeekItem from './useWeekItem';
import Typography from '@components/typography';
import ProgressBarSmall from '@components/progress_bar_small';

const WeekItem = ({ week }: WeekItemType) => {
  const { weekDateLocale } = useWeekItem(week);

  return (
    <Box
      sx={{
        padding: '8px 8px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--accent-200)',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          '.MuiTypography-root': {
            color: 'var(--accent-dark)',
          },
        },
      }}
    >
      <Typography>{weekDateLocale}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <ProgressBarSmall value={20} maxValue={20} />
        </Box>
        <Typography className="label-small-medium" sx={{ width: '48px' }} textAlign="right">
          20/20
        </Typography>
      </Box>
    </Box>
  );
};

export default WeekItem;
