import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAuxiliaryPioneer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-auxiliary-pioneer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3298_119083"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119083)">
          <path
            d="M6.69248 23.0004V15.4101L3.35596 10.0005L7.67323 3.00049H16.327L20.6443 10.0005L17.3078 15.4101V23.0004L12.0001 21.2024L6.69248 23.0004ZM8.19246 20.8793L12.0001 19.612L15.8078 20.8793V17.0004H8.19246V20.8793ZM8.50976 4.50046L5.10976 10.0005L8.50976 15.5005H15.4905L18.8905 10.0005L15.4905 4.50046H8.50976ZM10.9501 13.7197L7.75593 10.5505L8.82513 9.48126L10.9501 11.6063L15.1751 7.35626L16.2443 8.40046L10.9501 13.7197Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAuxiliaryPioneer;
