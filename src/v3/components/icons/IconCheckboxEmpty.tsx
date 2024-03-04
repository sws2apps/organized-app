import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCheckboxEmpty = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-checkbox-empty" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2704_41497"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_41497)">
          <path
            d="M5.3077 21.0004C4.80257 21.0004 4.375 20.8254 4.025 20.4754C3.675 20.1254 3.5 19.6979 3.5 19.1927V5.80819C3.5 5.30306 3.675 4.87549 4.025 4.52549C4.375 4.17549 4.80257 4.00049 5.3077 4.00049H18.6923C19.1974 4.00049 19.625 4.17549 19.975 4.52549C20.325 4.87549 20.5 5.30306 20.5 5.80819V19.1927C20.5 19.6979 20.325 20.1254 19.975 20.4754C19.625 20.8254 19.1974 21.0004 18.6923 21.0004H5.3077ZM5.3077 19.5005H18.6923C18.7692 19.5005 18.8397 19.4684 18.9038 19.4043C18.9679 19.3402 19 19.2697 19 19.1927V5.80819C19 5.73126 18.9679 5.66073 18.9038 5.59661C18.8397 5.53251 18.7692 5.50046 18.6923 5.50046H5.3077C5.23077 5.50046 5.16024 5.53251 5.09612 5.59661C5.03202 5.66073 4.99997 5.73126 4.99997 5.80819V19.1927C4.99997 19.2697 5.03202 19.3402 5.09612 19.4043C5.16024 19.4684 5.23077 19.5005 5.3077 19.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCheckboxEmpty;
