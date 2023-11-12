import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const CPETypography = ({ variant, margin = '0px', children }) => {
  return (
    <Typography className={variant} sx={{ color: 'var(--accent-400)', margin: margin }}>
      {children}
    </Typography>
  );
};

CPETypography.propTypes = {
  children: PropTypes.node,
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
  margin: PropTypes.string,
};

export default CPETypography;
