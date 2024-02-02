import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconMinistryReport = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-ministry-report" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_23754"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_23754)">
          <path
            d="M5.3077 19H14V14H19V5.3077C19 5.21795 18.9711 5.14423 18.9134 5.08653C18.8557 5.02883 18.782 4.99998 18.6923 4.99998H5.3077C5.21795 4.99998 5.14423 5.02883 5.08653 5.08653C5.02883 5.14423 4.99997 5.21795 4.99997 5.3077V18.6923C4.99997 18.782 5.02883 18.8557 5.08653 18.9134C5.14423 18.9711 5.21795 19 5.3077 19ZM5.3077 20.5C4.80898 20.5 4.38302 20.3233 4.02982 19.9701C3.67661 19.6169 3.5 19.191 3.5 18.6923V5.3077C3.5 4.80898 3.67661 4.38302 4.02982 4.02982C4.38302 3.67661 4.80898 3.5 5.3077 3.5H18.6923C19.191 3.5 19.6169 3.67661 19.9701 4.02982C20.3233 4.38302 20.5 4.80898 20.5 5.3077V14.6442L14.6442 20.5H5.3077ZM7.44233 13.7307V12.2308H12V13.7307H7.44233ZM7.44233 9.74995V8.25H16.5576V9.74995H7.44233Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMinistryReport;
