import { useId } from 'react';
import { Box, CircularProgress, Collapse } from '@mui/material';
import { IconCheck, IconCollapse } from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import type { MonthRowProps } from '@features/meetings/week_selector/month_row/index.types';
const MonthRow = ({
  label,
  expanded,
  onToggle,
  assigned,
  total,
  children,
}: MonthRowProps) => {
  const id = useId();
  const assignComplete = total > 0 && assigned === total;
  const assignPartial = assigned > 0 && assigned < total;
  return (
    <Box>
      <Button
        variant="secondary"
        disableAutoStretch
        ariaLabel={`${label}, ${assigned}/${total}`}
        aria-expanded={expanded}
        aria-controls={id}
        sx={{
          width: '100%',
          borderRadius: 'var(--radius-none)',
          textTransform: 'none',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          // Keep the status icons at their own size and colour.
          '& svg': {},
          '& svg, & svg g, & svg g path': {},
        }}
        onClick={onToggle}
      >
        <Typography className="h4">{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {assignComplete && (
            <Box
              sx={{
                borderRadius: 'var(--radius-max)',
                width: '18.4px',
                height: '18.4px',
                padding: '2px',
                backgroundColor: 'var(--accent-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck color="var(--white)" height={14.4} width={14.4} />
            </Box>
          )}

          {assignPartial && (
            <Box
              sx={{
                width: '18.4px',
                height: '18.4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={18.4}
                thickness={5}
                sx={{
                  color: 'var(--accent-200)',
                  position: 'absolute',
                }}
              />
              <CircularProgress
                variant="determinate"
                value={total > 0 ? (assigned / total) * 100 : 0}
                size={18.4}
                thickness={5}
                aria-label={`${assigned}/${total}`}
                sx={{
                  color: 'var(--accent-main)',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                    transition: 'stroke-dashoffset 0.4s ease',
                  },
                }}
              />
            </Box>
          )}

          <IconCollapse
            color="var(--black)"
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </Box>
      </Button>
      <Collapse id={id} in={expanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
};
export default MonthRow;
