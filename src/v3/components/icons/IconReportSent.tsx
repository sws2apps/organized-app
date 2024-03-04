import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconReportSent = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-report-sent" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3463_279834"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3463_279834)">
          <path
            d="M14.8518 22.436L9.90186 17.4861L11.2775 16.1104L14.8043 19.6372L22.5768 11.8647L23.9999 13.2878L14.8518 22.436Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.41457 18.3755H3.34188C3.25213 18.3755 3.1784 18.3466 3.1207 18.2889C3.063 18.2312 3.03415 18.1575 3.03415 18.0677V4.68319C3.03415 4.59344 3.063 4.51971 3.1207 4.46201C3.1784 4.40431 3.25213 4.37546 3.34188 4.37546H16.7264C16.8162 4.37546 16.8899 4.40431 16.9476 4.46201C17.0053 4.51971 17.0342 4.59344 17.0342 4.68319V13.3755V14.3539L18.5341 12.9772V4.68319C18.5341 4.18447 18.3575 3.75851 18.0043 3.40531C17.6511 3.0521 17.2251 2.87549 16.7264 2.87549H3.34188C2.84316 2.87549 2.4172 3.0521 2.064 3.40531C1.71079 3.75851 1.53418 4.18447 1.53418 4.68319V18.0677C1.53418 18.5665 1.71079 18.9924 2.064 19.3456C2.4172 19.6988 2.84316 19.8754 3.34188 19.8754H8.83345L7.41457 18.3755ZM18.4898 18.296C18.3207 19.0862 17.6848 19.7034 16.8846 19.8448L18.4898 18.296ZM5.4765 11.6062V13.1062H10.0342V11.6062H5.4765ZM5.4765 7.62549V9.12544H14.5918V7.62549H5.4765Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReportSent;
