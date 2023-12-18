import { Box } from '@mui/material';

import PropTypes from 'prop-types';

const CPEBadgeSmall = ({ color, text, sx = {} }) => {
  const getColor = () => {
    let result = '';

    if (color == 'grey') {
      result = `var(--${color}-400)`;
    } else if (color == 'green') {
      result = `var(--${color}-main)`;
    } else if (color == 'orange') {
      result = `var(--${color}-dark)`;
    } else if (color == 'accent') {
      result = `var(--${color}-dark)`;
    }

    return result;
  };

  const getBackgroundColor = () => {
    let result = '';

    if (color == 'grey') {
      result = `var(--${color}-100)`;
    } else if (color == 'green') {
      result = `var(--${color}-secondary)`;
    } else if (color == 'orange') {
      result = `var(--${color}-secondary)`;
    } else if (color == 'accent') {
      result = `var(--${color}-200)`;
    }

    return result;
  };

  return (
    <Box
      sx={{
        border: '2px',
        height: '20px',
        background: getBackgroundColor(color),
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 'var(--radius-xs, 2px)',
        gap: '4px',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '16px',
          paddingLeft: '6px',
          paddingRight: '6px',
          letterSpacing: '-0.12px',
          color: getColor(color),
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

CPEBadgeSmall.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['grey', 'green', 'orange', 'blue']).isRequired,
  sx: PropTypes.object,
};

export default CPEBadgeSmall;
