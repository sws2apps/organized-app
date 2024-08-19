import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCustomSchedule = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-custom-schedule ${className}`}
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
          id="mask0_4417_164286"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4417_164286)">
          <path
            d="M3.25 3.25049H10.75V10.7504H3.25V3.25049ZM13.25 3.25049H20.75V10.7504H13.25V3.25049ZM3.25 13.2505H10.75V20.7504H3.25V13.2505ZM16.25 13.2505H17.75V16.2505H20.75V17.7504H17.75V20.7504H16.25V17.7504H13.25V16.2505H16.25V13.2505ZM14.75 4.75044V9.25049H19.25V4.75044H14.75ZM4.74995 4.75044V9.25049H9.25V4.75044H4.74995ZM4.74995 14.7504V19.2505H9.25V14.7504H4.74995Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCustomSchedule;
