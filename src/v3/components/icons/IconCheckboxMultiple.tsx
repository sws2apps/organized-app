import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCheckboxMultiple = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-checkbox-multiple" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2714_39978"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2714_39978)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.3077 21.0004C4.80257 21.0004 4.375 20.8254 4.025 20.4754C3.675 20.1254 3.5 19.6979 3.5 19.1927V5.80819C3.5 5.30306 3.675 4.87549 4.025 4.52549C4.375 4.17549 4.80257 4.00049 5.3077 4.00049H18.6923C19.1974 4.00049 19.625 4.17549 19.975 4.52549C20.325 4.87549 20.5 5.30306 20.5 5.80819V19.1927C20.5 19.6979 20.325 20.1254 19.975 20.4754C19.625 20.8254 19.1974 21.0004 18.6923 21.0004H5.3077ZM16 11.5005H8V13.5005H16V11.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCheckboxMultiple;
