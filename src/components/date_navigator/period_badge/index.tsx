import { Box, useTheme } from '@mui/material';
import Badge from '@components/badge';
import Button from '@components/button';
import { IconUndo } from '@components/icons';
import Typography from '@components/typography';
import { DateNavigatorPeriodBadgeProps } from '@components/date_navigator/index.types';

/** Keeps both period states the same size, including translated labels. */
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
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        minWidth: 0,
        flexShrink: 1,
        maxWidth: '100%',
      }}
    >
      {[text, action.text].map((label, index) => (
        <Box
          key={index}
          aria-hidden
          sx={{
            gridArea: '1 / 1',
            visibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            minWidth: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ width: '16px', flexShrink: 0 }} />
          <Typography className="body-small-semibold" noWrap>
            {label}
          </Typography>
        </Box>
      ))}
      {current ? (
        <Badge
          size="small"
          color="accent"
          faded
          className="body-small-semibold"
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
            gridArea: '1 / 1',
            height: '32px',
            boxSizing: 'border-box',
            padding: '4px 8px',
            alignItems: 'center',
            minWidth: 0,
            overflow: 'hidden',
            borderRadius: 'var(--radius-m)',
            '& > div': { minWidth: 0 },
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
          ariaLabel={action.ariaLabel}
          onClick={interactive ? action.onClick : undefined}
          startIcon={
            <IconUndo
              color="var(--grey-400)"
              sx={{ transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }}
            />
          }
          sx={{
            gridArea: '1 / 1',
            minWidth: 0,
            width: '100%',
            height: '32px',
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
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {action.text}
          </Box>
        </Button>
      )}
    </Box>
  );
};

export default PeriodBadge;
