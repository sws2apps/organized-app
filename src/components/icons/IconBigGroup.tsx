import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconBigGroup = ({
  color = '#5065D0',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-custom ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="15.747"
          cy="16.216"
          r="3.059"
          stroke={color}
          fill="none"
          strokeWidth="1.728"
        />
        <circle
          cx="22.59"
          cy="7.658"
          r="3.059"
          stroke={color}
          fill="none"
          strokeWidth="1.728"
        />
        <circle
          cx="9.257"
          cy="7.658"
          r="3.059"
          stroke={color}
          fill="none"
          strokeWidth="1.728"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M10.52 24.742c-.785.604-.943 1.27-.943 1.602v.982h12.44v-.982c0-.303-.765-2.82-6.377-2.82-2.802 0-4.321.603-5.12 1.218Zm-1.054-1.369c1.207-.93 3.151-1.576 6.174-1.576 6.036 0 8.105 2.834 8.105 4.547v2.71H7.85v-2.71c0-.853.393-2.03 1.616-2.971Zm.225-10.037c-2.282.17-3.916.745-5.04 1.489-1.324.877-1.984 2.037-1.984 3.007v2.709h7.904a6.904 6.904 0 0 1-1.011-1.728H4.395v-.981c0-.217.204-.9 1.211-1.567.729-.483 1.86-.937 3.541-1.14.1-.63.286-1.23.544-1.79Zm12.736 1.772c1.914.175 3.172.663 3.96 1.185 1.007.667 1.21 1.35 1.21 1.567v.98h-5.381a6.889 6.889 0 0 1-.882 1.729h7.992v-2.71c0-.97-.66-2.129-1.985-3.007-1.21-.8-3.01-1.404-5.572-1.52a6.86 6.86 0 0 1 .658 1.776Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default IconBigGroup;
