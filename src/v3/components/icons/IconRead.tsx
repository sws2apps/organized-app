import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRead = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-read" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2538_45293"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2538_45293)">
          <path
            d="M6.6998 18.5006L1.0498 12.8506L2.4748 11.4506L8.1248 17.1006L6.6998 18.5006ZM12.3498 18.5006L6.6998 12.8506L8.0998 11.4256L12.3498 15.6756L21.5498 6.47559L22.9498 7.90059L12.3498 18.5006ZM12.3498 12.8506L10.9248 11.4506L15.8748 6.50059L17.2998 7.90059L12.3498 12.8506Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRead;
