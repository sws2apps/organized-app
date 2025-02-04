import { FC } from 'react';
import { Divider as MUIDivider } from '@mui/material';
import { CustomDividerProps } from './index.types';

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
const Divider: FC<CustomDividerProps> = ({
  height = 1,
  color = 'var(--accent-main)',
  dashed,
  sx,
  ...props
}: CustomDividerProps) => {
  return (
    <MUIDivider
      {...props}
      sx={
        dashed
          ? {
              backgroundImage: `repeating-linear-gradient(0deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(90deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(180deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px), repeating-linear-gradient(270deg, ${color}, ${color} 5px, transparent 5px, transparent 10px, ${color} 10px)`,
              backgroundSize: `1px 100%, 100% 1px, 1px 100% , 100% 1px`,
              backgroundPosition: `0 0, 0 0, 100% 0, 0 100%`,
              backgroundRepeat: `no-repeat`,
              borderColor: 'transparent',
              ...sx,
            }
          : {
              borderColor: color,
              borderRightWidth: height,
              borderBottomWidth: height,
              '::before, ::after': {
                borderTop: `1px solid ${color}`,
              },
              ...sx,
            }
      }
    />
  );
};

export default Divider;
