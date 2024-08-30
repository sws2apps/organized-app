import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconWine = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-wine ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_13644_20539"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13644_20539)">
          <path
            d="M8.34621 21V19.5H11.2501V15.1884C9.81672 14.9615 8.65711 14.3157 7.77121 13.2509C6.88532 12.1862 6.44238 10.9359 6.44238 9.49998V4H17.5577V9.49998C17.5577 10.9359 17.1147 12.1862 16.2289 13.2509C15.343 14.3157 14.1833 14.9615 12.75 15.1884V19.5H15.6539V21H8.34621ZM12 13.75C12.9911 13.75 13.8558 13.4154 14.5943 12.7461C15.3327 12.0769 15.7898 11.2448 15.9654 10.25H8.03463C8.21027 11.2448 8.66732 12.0769 9.40578 12.7461C10.1442 13.4154 11.009 13.75 12 13.75ZM7.94233 8.75H16.0577V5.49998H7.94233V8.75Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconWine;
