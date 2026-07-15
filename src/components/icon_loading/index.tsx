import { Box } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * A short arc sweeps over a faint full-circle track. The rotation happens
 * inside a static SVG (only the arc turns, via a user-space rotate), so the
 * element's box never changes size or position — rotating an HTML box instead
 * makes its bounding box pulse between the side and diagonal, which reads as
 * the spinner drifting.
 */
const IconLoading = ({
  color = 'var(--black)',
  width = 24,
  height = 24,
  sx = {},
}: IconLoadingProps) => {
  const stroke = 2.4;
  const radius = 12 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.25;

  return (
    <Box
      sx={{
        width,
        height,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
    >
      <svg width={width} height={width} viewBox="0 0 24 24">
        <circle
          cx={12}
          cy={12}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          opacity={0.25}
        />
        <circle
          cx={12}
          cy={12}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </Box>
  );
};

export default IconLoading;
