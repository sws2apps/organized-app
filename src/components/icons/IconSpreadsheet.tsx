import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSpreadsheet = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-spreadsheet ${className}`}
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
          id="mask0_2982_68401"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2982_68401)">
          <path
            d="M3.5 5.11586V3.50049H5.11537V5.11586H3.5ZM7.34615 5.11586V3.50049H8.9615V5.11586H7.34615ZM15.0385 5.11586V3.50049H16.6538V5.11586H15.0385ZM18.8846 5.11586V3.50049H20.5V5.11586H18.8846ZM3.5 8.96199V7.34664H5.11537V8.96199H3.5ZM18.8846 8.96199V7.34664H20.5V8.96199H18.8846ZM3.5 16.6543V15.0389H5.11537V16.6543H3.5ZM18.8846 16.6543V15.0389H20.5V16.6543H18.8846ZM3.5 20.5004V18.8851H5.11537V20.5004H3.5ZM7.34615 20.5004V18.8851H8.9615V20.5004H7.34615ZM15.0385 20.5004V18.8851H16.6538V20.5004H15.0385ZM18.8846 20.5004V18.8851H20.5V20.5004H18.8846ZM11.1923 20.5004V12.8081H3.5V11.1928H11.1923V3.50049H12.8077V11.1928H20.5V12.8081H12.8077V20.5004H11.1923Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSpreadsheet;
