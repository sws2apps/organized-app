import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPhone = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-phone" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2704_31559"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_31559)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.025 22.4754C6.375 22.8254 6.80257 23.0004 7.3077 23.0004L16.6922 23.0004C17.1974 23.0004 17.625 22.8254 17.975 22.4754C18.325 22.1254 18.5 21.6979 18.5 21.1927V3.80819C18.5 3.30306 18.325 2.87549 17.975 2.52549C17.625 2.17549 17.1974 2.00049 16.6922 2.00049H7.3077C6.80257 2.00049 6.375 2.17549 6.025 2.52549C5.675 2.87549 5.5 3.30306 5.5 3.80819V21.1927C5.5 21.6979 5.675 22.1254 6.025 22.4754ZM6.99997 21.1928V20.2505H7V18.7505H6.99997V6.25046H7V4.75051H6.99997V3.80821C6.99997 3.73128 7.03202 3.66076 7.09613 3.59664C7.16024 3.53254 7.23077 3.50049 7.3077 3.50049H16.6922C16.7692 3.50049 16.8397 3.53254 16.9038 3.59664C16.9679 3.66076 17 3.73128 17 3.80821V4.50049H17V20.5005H17V21.1928C17 21.2697 16.9679 21.3402 16.9038 21.4043C16.8397 21.4684 16.7692 21.5005 16.6922 21.5005H7.3077C7.23077 21.5005 7.16024 21.4684 7.09613 21.4043C7.03202 21.3402 6.99997 21.2697 6.99997 21.1928Z"
            fill={color}
          />
          <rect x="9" y="19.5005" width="6" height="1" rx="0.5" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPhone;
