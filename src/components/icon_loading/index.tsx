import { Box } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * An indeterminate arc sweeps over a faint full-circle track: it rotates while
 * its length eases longer and shorter, which feels livelier than a constant
 * spin and makes the wait read as shorter. Both animations run on the arc
 * element inside a static SVG, so the element's box never transforms — that
 * keeps it from pulsing or drifting the way a rotated HTML box does.
 */
const IconLoading = ({
  color = 'var(--black)',
  width = 24,
  height = 24,
  sx = {},
}: IconLoadingProps) => {
  return (
    <Box
      sx={{
        width,
        height,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .icon-loading-head': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation:
            'icon-loading-rotate 1.4s linear infinite, icon-loading-dash 1.4s ease-in-out infinite',
        },
        '@keyframes icon-loading-rotate': {
          to: { transform: 'rotate(360deg)' },
        },
        '@keyframes icon-loading-dash': {
          '0%': { strokeDasharray: '1px, 200px', strokeDashoffset: 0 },
          '50%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-15px' },
          '100%': {
            strokeDasharray: '100px, 200px',
            strokeDashoffset: '-125px',
          },
        },
        ...sx,
      }}
    >
      <svg width={width} height={width} viewBox="22 22 44 44">
        <circle
          cx={44}
          cy={44}
          r={20.2}
          fill="none"
          stroke={color}
          strokeWidth={3.6}
          opacity={0.25}
        />
        <circle
          className="icon-loading-head"
          cx={44}
          cy={44}
          r={20.2}
          fill="none"
          stroke={color}
          strokeWidth={3.6}
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
};

export default IconLoading;
