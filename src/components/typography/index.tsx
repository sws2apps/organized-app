import { Typography } from '@mui/material';
import { TypographyTypeProps } from './index.types';

/**
 * CustomTypography is a component that wraps Material-UI Typography component
 * with additional customization options such as color and class name.
 *
 * @param props - The properties for the CustomTypography component.
 * @returns A customized Typography component.
 */
const CustomTypography = (props: TypographyTypeProps) => {
  const color = props.color || 'var(--black)';
  const className = props.className || 'body-regular';

  return (
    <Typography {...props} className={className} color={color}>
      {props.children}
    </Typography>
  );
};

export default CustomTypography;
