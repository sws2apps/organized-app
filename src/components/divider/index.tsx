import { Divider as MUIDivider } from '@mui/material';
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
const Divider = (props: CustomDividerProps) => {
  const height = props.height || 1;
  const color = props.color || 'var(--accent-main)';

  return (
    <MUIDivider
      sx={
        props.dashed
          ? {
              backgroundImage: `repeating-linear-gradient(0deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(90deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(180deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(270deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px)`,
              backgroundSize: `1px 100%, 100% 1px, 1px 100% , 100% 1px`,
              backgroundPosition: `0 0, 0 0, 100% 0, 0 100%`,
              backgroundRepeat: `no-repeat`,
              borderColor: 'transparent',
            }
          : {
              ...props.sx,
              border: 'none',
              borderBottom: `${height}px solid ${color}`,
            }
      }
    />
  );
};

export default Divider;
