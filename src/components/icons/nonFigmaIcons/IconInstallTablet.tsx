import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconInstallTablet = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-install-tablet${className ? ` ${className}` : ''}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h182.3v60h-182.3q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h615.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85h-182.3v-60h182.3Q818-780 839-759q21 21 21 51.31v455.38Q860-222 839-201q-21 21-51.31 21H172.31ZM480-414 293.85-580 336-615l114 114V-780h60v279l114-114 42.15 35L480-414Z"
          fill={color}
        />
        <rect x="360" y="-330" width="240" height="50" rx="0" fill={color} />
      </svg>
    </SvgIcon>
  );
};

export default IconInstallTablet;
