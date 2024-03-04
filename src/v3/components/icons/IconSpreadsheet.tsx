import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSpreadsheet = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-spreadsheet" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2982_68401"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2982_68401)">
          <path
            d="M3.5 5.61586V4.00049H5.11537V5.61586H3.5ZM7.34615 5.61586V4.00049H8.9615V5.61586H7.34615ZM15.0385 5.61586V4.00049H16.6538V5.61586H15.0385ZM18.8846 5.61586V4.00049H20.5V5.61586H18.8846ZM3.5 9.46199V7.84664H5.11537V9.46199H3.5ZM18.8846 9.46199V7.84664H20.5V9.46199H18.8846ZM3.5 17.1543V15.5389H5.11537V17.1543H3.5ZM18.8846 17.1543V15.5389H20.5V17.1543H18.8846ZM3.5 21.0004V19.3851H5.11537V21.0004H3.5ZM7.34615 21.0004V19.3851H8.9615V21.0004H7.34615ZM15.0385 21.0004V19.3851H16.6538V21.0004H15.0385ZM18.8846 21.0004V19.3851H20.5V21.0004H18.8846ZM11.1923 21.0004V13.3081H3.5V11.6928H11.1923V4.00049H12.8077V11.6928H20.5V13.3081H12.8077V21.0004H11.1923Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSpreadsheet;
