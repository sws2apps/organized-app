import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMapView = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-map-view ${className}`}
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
          id="mask0_4944_2978239"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2978239)">
          <path
            d="M11.9999 19.8967L3.80762 13.5313L5.03452 12.5891L11.9999 17.9813L18.9652 12.5891L20.1921 13.5313L11.9999 19.8967ZM11.9999 15.4621L3.80762 9.09677L11.9999 2.73145L20.1921 9.09677L11.9999 15.4621ZM11.9999 13.5468L17.7499 9.09677L11.9999 4.64677L6.24987 9.09677L11.9999 13.5468Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMapView;
