import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDownload = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-download ${className}`}
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
          id="mask0_4918_2971395"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4918_2971395)">
          <path
            d="M12 15.7889L7.7308 11.5197L8.78462 10.4351L11.25 12.9005V4.50049H12.7499V12.9005L15.2153 10.4351L16.2692 11.5197L12 15.7889ZM6.3077 19.5004C5.80257 19.5004 5.375 19.3254 5.025 18.9754C4.675 18.6254 4.5 18.1979 4.5 17.6927V14.9812H5.99997V17.6927C5.99997 17.7697 6.03202 17.8402 6.09612 17.9043C6.16024 17.9684 6.23077 18.0005 6.3077 18.0005H17.6922C17.7692 18.0005 17.8397 17.9684 17.9038 17.9043C17.9679 17.8402 18 17.7697 18 17.6927V14.9812H19.5V17.6927C19.5 18.1979 19.325 18.6254 18.975 18.9754C18.625 19.3254 18.1974 19.5004 17.6922 19.5004H6.3077Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDownload;
