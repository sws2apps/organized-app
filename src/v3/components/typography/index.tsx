import { Typography } from '@mui/material';
import { TypographyTypeProps } from './index.types';

const CPETypography = (props: TypographyTypeProps) => {
  const color = props.color || 'var(--black)';
  const className = props.className || 'body-regular';

  return (
    <Typography {...props} className={className} color={color}>
      {props.children}
    </Typography>
  );
};

export default CPETypography;
