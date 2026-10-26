import { Box, useTheme } from '@mui/material';
import Badge from '@components/badge';
import Button from '@components/button';
import { IconUndo } from '@components/icons';
import Typography from '@components/typography';
import { DateNavigatorPeriodBadgeProps } from '@components/date_navigator/index.types';

/** Compact current-period status and return action with content-sized widths. */
const PeriodBadge = ({
  text,
  current,
  action,
  interactive,
}: DateNavigatorPeriodBadgeProps) => {
  const { direction } = useTheme();

  return (
    <Box
      sx={{
        // Avoid inline baseline space shifting the badge inside block wrappers.
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        flexShrink: 1,
        maxWidth: '100%',
      }}
    >
      {current ? (
        <Badge
          size="small"
          color="accent"
          faded
          className="label-small-semibold"
          centerContent
          text={text}
          icon={
            <Box
              component="span"
              aria-hidden
              sx={{ width: '16px', display: 'flex', justifyContent: 'center' }}
            >
              <Box
                component="span"
                sx={{
                  width: '6px',
                  height: '6px',
                  borderRadius: 'var(--radius-max)',
                  backgroundColor: 'var(--accent-dark)',
                }}
              />
            </Box>
          }
          sx={{
            height: '24px',
            boxSizing: 'border-box',
            padding: '2px 6px',
            alignItems: 'center',
            minWidth: 0,
            maxWidth: '100%',
            flexShrink: 1,
            overflow: 'hidden',
            borderRadius: 'var(--radius-m)',
            '& > div': { minWidth: 0, alignItems: 'center' },
            '& .MuiTypography-root': {
              display: 'block',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      ) : (
        <Button
          variant="small"
          disableAutoStretch
          minHeight={24}
          ariaLabel={action.ariaLabel}
          onClick={interactive ? action.onClick : undefined}
          startIcon={
            <IconUndo
              color="var(--grey-400)"
              sx={{ transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }}
            />
          }
          sx={{
            minWidth: 0,
            width: 'auto',
            maxWidth: '100%',
            height: '24px',
            padding: '2px 6px',
            gap: '4px',
            color: 'var(--grey-400)',
            backgroundColor: 'var(--grey-100)',
            pointerEvents: interactive ? 'auto' : 'none',
            '& .MuiButton-startIcon': { margin: 0, flexShrink: 0 },
            '& svg': { width: '16px', height: '16px' },
            '& svg, & svg g, & svg g path': { fill: 'var(--grey-400)' },
            '&:hover, &:active': { backgroundColor: 'var(--grey-200)' },
          }}
        >
          <Typography
            component="span"
            className="label-small-semibold"
            color="var(--grey-400)"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {action.text}
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export default PeriodBadge;
