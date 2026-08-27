import { Box } from '@mui/material';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { IndicatorProps } from './index.types';

/**
 * Indicator component used to display calculated values (like age or years)
 * next to input fields. Designed to fit content width and match parent height.
 */
const Indicator = ({ children, tooltip, showTooltip = true }: IndicatorProps) => {
  return (
    <Tooltip title={tooltip} show={showTooltip && !!tooltip}>
      <Box
        sx={{
          backgroundColor: 'var(--accent-150)',
          border: '1px solid var(--accent-200)',
          padding: '0 16px',
          borderRadius: 'var(--radius-l)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'max-content',
          minWidth: '60px',
          height: '44px',
          userSelect: 'none',
        }}
      >
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {children}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export { default as IndicatorRow } from './row';
export default Indicator;
