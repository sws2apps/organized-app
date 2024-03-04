import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconStats = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-stats" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2457_20498"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_20498)">
          <path
            d="M7.39997 22.1543L6.34615 21.1005L12.9 14.5313L16.4 18.0313L21.575 12.8563L22.6442 13.9255L16.4 20.1543L12.9 16.6543L7.39997 22.1543ZM4.3077 21.0004C3.80257 21.0004 3.375 20.8254 3.025 20.4754C2.675 20.1254 2.5 19.6979 2.5 19.1927V5.80819C2.5 5.30306 2.675 4.87549 3.025 4.52549C3.375 4.17549 3.80257 4.00049 4.3077 4.00049H17.6923C18.1974 4.00049 18.625 4.17549 18.975 4.52549C19.325 4.87549 19.5 5.30306 19.5 5.80819V10.0082H3.99998V19.1927C3.99998 19.2697 4.03202 19.3402 4.09612 19.4043C4.16024 19.4684 4.23077 19.5005 4.3077 19.5005V21.0004ZM3.99998 8.50821H18V5.80819C18 5.73126 17.9679 5.66073 17.9038 5.59661C17.8397 5.53251 17.7692 5.50046 17.6923 5.50046H4.3077C4.23077 5.50046 4.16024 5.53251 4.09612 5.59661C4.03202 5.66073 3.99998 5.73126 3.99998 5.80819V8.50821Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconStats;
