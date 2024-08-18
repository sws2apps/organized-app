import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFilter = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-filter ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_4451_159612"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4451_159612)">
          <path
            d="M11.3848 19.5004C11.1335 19.5004 10.9232 19.4158 10.754 19.2466C10.5847 19.0774 10.5001 18.8671 10.5001 18.6158V12.8274L4.90208 5.71586C4.70978 5.45945 4.6819 5.19278 4.81843 4.91586C4.95497 4.63895 5.18541 4.50049 5.50976 4.50049H18.4905C18.8148 4.50049 19.0452 4.63895 19.1818 4.91586C19.3183 5.19278 19.2904 5.45945 19.0981 5.71586L13.5001 12.8274V18.6158C13.5001 18.8671 13.4155 19.0774 13.2462 19.2466C13.077 19.4158 12.8667 19.5004 12.6155 19.5004H11.3848ZM12.0001 12.3005L16.9501 6.00046H7.05011L12.0001 12.3005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFilter;
