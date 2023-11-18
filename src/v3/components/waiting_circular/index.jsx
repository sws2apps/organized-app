import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const WaitingCircular = ({ variant = 'fixed' }) => {
  let style = {};

  if (variant === 'fixed') {
    style = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
    };
  }

  return (
    <CircularProgress
      size={80}
      disableShrink={true}
      sx={{
        color: 'var(--accent-dark)',
        ...style,
      }}
    />
  );
};

WaitingCircular.propTypes = {
  variant: PropTypes.oneOf(['fixed', 'standard']),
};

export default WaitingCircular;
