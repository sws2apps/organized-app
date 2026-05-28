import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPinSymbolSquare = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-pin-symbol-square ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="-1.24268"
          y="7.92188"
          width="12.9629"
          height="12.9629"
          rx="3"
          transform="rotate(-45 -1.24268 7.92188)"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconPinSymbolSquare;
