import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAssistant = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-assistant" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3106_63388"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3106_63388)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.21153 20.0004L12 22.7888L14.7884 20.0004H18.6923C19.1974 20.0004 19.625 19.8254 19.975 19.4754C20.325 19.1254 20.5 18.6979 20.5 18.1927V4.80819C20.5 4.30305 20.325 3.87549 19.975 3.52549C19.625 3.17549 19.1974 3.00049 18.6923 3.00049H5.3077C4.80257 3.00049 4.375 3.17549 4.025 3.52549C3.675 3.87549 3.5 4.30305 3.5 4.80819V18.1927C3.5 18.6979 3.675 19.1254 4.025 19.4754C4.375 19.8254 4.80257 20.0004 5.3077 20.0004H9.21153ZM5 17.5427C4.99999 17.5427 4.99998 17.5428 4.99997 17.5428V4.80816C4.99997 4.80692 4.99998 4.80568 5 4.80444V4.80043C5 4.63474 5.13431 4.50043 5.3 4.50043H18.7C18.8657 4.50043 19 4.63474 19 4.80043V18.2004C19 18.3661 18.8657 18.5004 18.7 18.5004H17.5577V18.5004H6.44225V18.5004H5.3C5.13431 18.5004 5 18.3661 5 18.2004L5 17.5427Z"
            fill={color}
          />
          <path
            d="M12 6.50049L13.3505 10.15L17 11.5005L13.3505 12.8509L12 16.5005L10.6495 12.8509L7 11.5005L10.6495 10.15L12 6.50049Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAssistant;
