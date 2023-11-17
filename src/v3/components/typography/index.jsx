import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const CPETypography = ({ variant, children, color = 'var(--accent-400)', sx = {} }) => {
  return (
    <Typography className={variant} sx={{ color: color, ...sx }}>
      {children}
    </Typography>
  );
};

CPETypography.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  variant: PropTypes.oneOf([
    'huge-numbers',
    'big-numbers',
    'label-small-medium',
    'label-small-regular',
    'h1',
    'h2',
    'h2-caps',
    'h3',
    'h4',
    'button-caps',
    'body-regular',
    'body-small-semibold',
    'body-small-regular',
  ]),
  color: PropTypes.string,
};

export default CPETypography;
