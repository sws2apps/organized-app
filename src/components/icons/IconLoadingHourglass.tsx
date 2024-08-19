import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLoadingHourglass = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-loading-hourglass ${className}`}
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
          id="mask0_2653_26742"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2653_26742)">
          <path
            d="M7.90382 20.0005H16.0961V17.0005C16.0961 15.862 15.6981 14.8883 14.9019 14.0793C14.1058 13.2703 13.1384 12.8658 12 12.8658C10.8615 12.8658 9.8942 13.2703 9.09805 14.0793C8.3019 14.8883 7.90382 15.862 7.90382 17.0005V20.0005ZM12 11.1351C13.1384 11.1351 14.1058 10.7306 14.9019 9.92161C15.6981 9.11265 16.0961 8.13893 16.0961 7.00046V4.00046H7.90382V7.00046C7.90382 8.13893 8.3019 9.11265 9.09805 9.92161C9.8942 10.7306 10.8615 11.1351 12 11.1351ZM4.5 21.5004V20.0005H6.40385V17.0005C6.40385 15.8748 6.71187 14.8501 7.3279 13.9264C7.94393 13.0027 8.76029 12.3607 9.77697 12.0005C8.76029 11.6338 7.94393 10.9902 7.3279 10.0697C6.71187 9.1492 6.40385 8.12611 6.40385 7.00046V4.00046H4.5V2.50049H19.5V4.00046H17.5961V7.00046C17.5961 8.12611 17.2881 9.1492 16.672 10.0697C16.056 10.9902 15.2397 11.6338 14.223 12.0005C15.2397 12.3607 16.056 13.0027 16.672 13.9264C17.2881 14.8501 17.5961 15.8748 17.5961 17.0005V20.0005H19.5V21.5004H4.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLoadingHourglass;
