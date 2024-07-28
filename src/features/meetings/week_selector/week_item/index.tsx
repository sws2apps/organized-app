import { Box } from '@mui/material';
import { WeekItemType } from './index.types';
import useWeekItem from './useWeekItem';
import Typography from '@components/typography';
import ProgressBarSmall from '@components/progress_bar_small';

const WeekItem = ({ week }: WeekItemType) => {
  const { weekDateLocale, handleSelectWeek, isSelected, assigned, total } =
    useWeekItem(week);

  return (
    <Box
      sx={{
        cursor: 'pointer',
        padding: '8px 8px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--accent-200)',
        backgroundColor: isSelected ? 'var(--accent-150)' : 'unset',
        '.MuiTypography-root': {
          color: isSelected ? 'var(--accent-dark)' : 'var(--black)',
        },
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          '.MuiTypography-root': {
            color: 'var(--accent-dark)',
          },
        },
      }}
      onClick={() => handleSelectWeek(week)}
    >
      <Typography>{weekDateLocale}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '144px' }}>
        <ProgressBarSmall value={assigned} maxValue={total} />
        <Typography
          className="label-small-medium"
          sx={{ width: '48px' }}
          textAlign="right"
        >
          {total > 0 && `${assigned}/${total}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default WeekItem;
