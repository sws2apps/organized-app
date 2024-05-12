import { Divider } from '@mui/material';
import { CustomDividerProps } from './divider.types';

/**
 * A customizable divider component.
 *
 * Renders a divider line with specified height and color.
 *
 * @param {CustomDividerProps} props - The props for the custom divider.
 * @returns {JSX.Element} - The rendered custom divider.
 *
 * @example
 * // Example usage of CustomDivider component
 * <CustomDivider color="blue" height={2} />
 */
const CustomDivider = (props: CustomDividerProps) => {
  const height = props.height || 1;
  const color = props.color || 'var(--accent-main)';

  return (
    <Divider
      sx={{
        ...props.sx,
        border: 'none',
        borderBottom: `${height}px solid ${color}`,
      }}
    />
  );
};

export default CustomDivider;
