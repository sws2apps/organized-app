import { Box } from '@mui/material';
import Button from '@components/button';
import Typography from '@components/typography';
import ProgressBarSmall from '@components/progress_bar_small';
import type { WeekRowProps } from '@features/meetings/week_selector/week_row/index.types';
const WeekRow = ({
  label,
  isSelected,
  onSelect,
  assigned,
  total,
}: WeekRowProps) => {
  return (
    <Button
      variant="secondary"
      disableAutoStretch
      aria-pressed={isSelected}
      ariaLabel={`${label}, ${assigned}/${total}`}
      sx={{
        width: '100%',
        borderRadius: 'var(--radius-none)',
        minWidth: 0,
        gap: '8px',
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
      onClick={onSelect}
    >
      <Typography sx={{ textAlign: 'start', overflowWrap: 'anywhere' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '144px',
          maxWidth: '48%',
          flexShrink: 0,
        }}
      >
        <ProgressBarSmall value={assigned} maxValue={total} />
        <Typography
          className="label-small-medium"
          sx={{
            textAlign: 'right',
            width: '48px',
          }}
        >
          {total > 0 && `${assigned}/${total}`}
        </Typography>
      </Box>
    </Button>
  );
};
export default WeekRow;
