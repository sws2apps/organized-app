import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLogin = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-login ${className}`}
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
          id="mask0_5245_210951"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5245_210951)">
          <path
            d="M18.6923 20.5004C19.1974 20.5004 19.625 20.3254 19.975 19.9754C20.325 19.6254 20.5 19.1979 20.5 18.6927V5.30819C20.5 4.80306 20.325 4.37549 19.975 4.02549C19.625 3.67549 19.1974 3.50049 18.6923 3.50049H11.9904V5.00046H18.6923C18.7692 5.00046 18.8398 5.03251 18.9039 5.09661C18.968 5.16073 19 5.23126 19 5.30819V18.6927C19 18.7697 18.968 18.8402 18.9039 18.9043C18.8398 18.9684 18.7692 19.0005 18.6923 19.0005H11.9904V20.5004H18.6923Z"
            fill={color}
          />
          <path
            d="M9.5962 15.1852L10.6346 16.2698L14.9038 12.0006L10.6346 7.73145L9.5962 8.81602L12.0308 11.2506H3.5V12.7506H12.0308L9.5962 15.1852Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLogin;
