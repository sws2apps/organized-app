import { Box } from '@mui/material';
import { TabLabelProps } from './index.types';
import Typography from '@components/typography';

/**
 * A custom tab label component.
 *
 * @param props The props for the TabLabel component.
 */
const TabLabel = ({ label, badge, selected }: TabLabelProps) => {
  // only plain text is rendered twice to reserve the width of its bold
  // variant: a component label would run its effects and repeat its ids
  const isText = typeof label === 'string' || typeof label === 'number';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {isText ? (
        <Box
          sx={{
            display: 'grid',
            justifyItems: 'center',
            '& > *': { gridArea: '1 / 1' },
          }}
        >
          <Box
            className="h4"
            aria-hidden={!selected}
            sx={{ visibility: selected ? 'visible' : 'hidden' }}
          >
            {label}
          </Box>

          <Box
            className="body-regular"
            aria-hidden={selected}
            sx={{ visibility: selected ? 'hidden' : 'visible' }}
          >
            {label}
          </Box>
        </Box>
      ) : (
        <Box className={selected ? 'h4' : 'body-regular'}>{label}</Box>
      )}

      {typeof badge === 'number' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-s)',
            backgroundColor: 'var(--accent-150)',
          }}
        >
          <Typography className="body-small-semibold" color="inherit">
            {badge}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TabLabel;
