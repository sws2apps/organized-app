import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconInstall = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-install" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2674_31400"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_31400)">
          <path
            d="M5.3077 23.0004C4.80257 23.0004 4.375 22.8254 4.025 22.4754C3.675 22.1254 3.5 21.6979 3.5 21.1927V3.80819C3.5 3.30306 3.675 2.87549 4.025 2.52549C4.375 2.17549 4.80257 2.00049 5.3077 2.00049H12.0385V3.50046H5.3077C5.23077 3.50046 5.16024 3.53251 5.09613 3.59661C5.03202 3.66073 4.99997 3.73126 4.99997 3.80819V4.75049H12.0385V6.25044H4.99997V18.7505H15V16.7505H16.5V21.1927C16.5 21.6979 16.325 22.1254 15.975 22.4754C15.625 22.8254 15.1974 23.0004 14.6922 23.0004L5.3077 23.0004ZM4.99997 20.2505V21.1928C4.99997 21.2697 5.03202 21.3402 5.09613 21.4043C5.16024 21.4684 5.23077 21.5005 5.3077 21.5005H14.6922C14.7692 21.5005 14.8397 21.4684 14.9038 21.4043C14.9679 21.3402 15 21.2697 15 21.1928V20.2505H4.99997ZM16 14.1447L11.3461 9.49084L12.4 8.43704L15.25 11.287V3.75049H16.75V11.287L19.6 8.43704L20.6538 9.49084L16 14.1447Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconInstall;
