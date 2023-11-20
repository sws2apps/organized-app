import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const CPETypography = ({ variant, children, color = 'var(--accent-400)', sx = {} }) => {
  const element = document.querySelector('.body-small-semibold');
  const stylesAnchor = window.getComputedStyle(element);

  const bodySmallSemibold = {
    fontSize: stylesAnchor.fontSize,
    textDecoration: stylesAnchor.textDecoration,
    fontFamily: stylesAnchor.fontFamily,
    fontWeight: stylesAnchor.fontWeight,
    fontStyle: stylesAnchor.fontStyle,
    fontStretch: stylesAnchor.fontStretch,
    letterSpacing: stylesAnchor.letterSpacing,
    lineHeight: stylesAnchor.lineHeight,
    textIndent: stylesAnchor.textIndent,
    textTransform: stylesAnchor.textTransform,
  };

  return (
    <Typography
      className={variant}
      sx={{
        color: color,
        ...sx,
        '& a, & span a': {
          ...bodySmallSemibold,
          color: 'var(--accent-main)',
        },
      }}
    >
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
