import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconReportSent = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-report-sent ${className}`}
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
          id="mask0_3463_279834"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3463_279834)">
          <path
            d="M14.8518 21.936L9.90186 16.9861L11.2775 15.6104L14.8043 19.1372L22.5768 11.3647L23.9999 12.7878L14.8518 21.936Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.41457 17.8755H3.34188C3.25213 17.8755 3.1784 17.8466 3.1207 17.7889C3.063 17.7312 3.03415 17.6575 3.03415 17.5677V4.18319C3.03415 4.09344 3.063 4.01971 3.1207 3.96201C3.1784 3.90431 3.25213 3.87546 3.34188 3.87546H16.7264C16.8162 3.87546 16.8899 3.90431 16.9476 3.96201C17.0053 4.01971 17.0342 4.09344 17.0342 4.18319V12.8755V13.8539L18.5341 12.4772V4.18319C18.5341 3.68447 18.3575 3.25851 18.0043 2.90531C17.6511 2.5521 17.2251 2.37549 16.7264 2.37549H3.34188C2.84316 2.37549 2.4172 2.5521 2.064 2.90531C1.71079 3.25851 1.53418 3.68447 1.53418 4.18319V17.5677C1.53418 18.0665 1.71079 18.4924 2.064 18.8456C2.4172 19.1988 2.84316 19.3754 3.34188 19.3754H8.83345L7.41457 17.8755ZM18.4898 17.796C18.3207 18.5862 17.6848 19.2034 16.8846 19.3448L18.4898 17.796ZM5.4765 11.1062V12.6062H10.0342V11.1062H5.4765ZM5.4765 7.12549V8.62544H14.5918V7.12549H5.4765Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReportSent;
