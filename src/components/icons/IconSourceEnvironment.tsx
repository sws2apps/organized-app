import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSourceEnvironment = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-source_environment ${className}`}
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
          id="mask0_4944_2980561"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980561)">
          <path
            d="M2.36523 20.5776V4.32755L7.11521 0.885254L11.8652 4.32755V7.07758H21.6344V20.5776H2.36523ZM3.86518 19.0776H6.36521V16.5776H3.86518V19.0776ZM3.86518 15.0776H6.36521V12.5776H3.86518V15.0776ZM3.86518 11.0776H6.36521V8.57755H3.86518V11.0776ZM3.86518 7.07758H6.36521V4.57755H3.86518V7.07758ZM7.86518 7.07758H10.3652V4.57755H7.86518V7.07758ZM7.86518 19.0776H20.1344V8.57755H7.86518V19.0776ZM14.0575 12.5776V11.0776H17.7498V12.5776H14.0575ZM14.0575 16.5776V15.0776H17.7498V16.5776H14.0575ZM10.3652 12.5776V11.0776H11.8652V12.5776H10.3652ZM10.3652 16.5776V15.0776H11.8652V16.5776H10.3652Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSourceEnvironment;
