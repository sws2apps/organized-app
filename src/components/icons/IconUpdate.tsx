import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconUpdate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-update ${className}`}
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
          id="mask0_2710_34461"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2710_34461)">
          <path
            d="M7.25 19.5004V18.0005H16.75V19.5004H7.25ZM11.25 15.8081V7.35426L8.39035 10.1985L7.34615 9.15431L12 4.50049L16.6538 9.15431L15.6096 10.1985L12.7499 7.35426V15.8081H11.25Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUpdate;
