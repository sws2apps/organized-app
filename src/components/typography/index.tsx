import { Typography as MUITypography, SxProps } from '@mui/material';
import { TypographyTypeProps } from './index.types';

/**
 * CustomTypography is a component that wraps Material-UI Typography component
 * with additional customization options such as color and class name.
 *
 * @param props - The properties for the CustomTypography component.
 * @returns A customized Typography component.
 */
const Typography = (props: TypographyTypeProps) => {
  const color = props.color || 'var(--black)';
  const className = props.className || 'body-regular';

  const sx = (props.sx ? [{ color }, props.sx] : [{ color }]) as SxProps;

  return (
    <MUITypography {...props} className={className} sx={sx}>
      {props.children}
    </MUITypography>
  );
};

export default Typography;
