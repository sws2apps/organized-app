import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMinistryReport = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-ministry-report ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_2515_23754"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_23754)">
          <path
            d="M5.3077 19.0005H14V14.0005H19V5.30819C19 5.21844 18.9711 5.14471 18.9134 5.08701C18.8557 5.02931 18.782 5.00046 18.6923 5.00046H5.3077C5.21795 5.00046 5.14423 5.02931 5.08653 5.08701C5.02883 5.14471 4.99997 5.21844 4.99997 5.30819V18.6927C4.99997 18.7825 5.02883 18.8562 5.08653 18.9139C5.14423 18.9716 5.21795 19.0005 5.3077 19.0005ZM5.3077 20.5004C4.80898 20.5004 4.38302 20.3238 4.02982 19.9706C3.67661 19.6174 3.5 19.1915 3.5 18.6927V5.30819C3.5 4.80947 3.67661 4.38351 4.02982 4.03031C4.38302 3.6771 4.80898 3.50049 5.3077 3.50049H18.6923C19.191 3.50049 19.6169 3.6771 19.9701 4.03031C20.3233 4.38351 20.5 4.80947 20.5 5.30819V14.6447L14.6442 20.5004H5.3077ZM7.44233 13.7312V12.2312H12V13.7312H7.44233ZM7.44233 9.75044V8.25049H16.5576V9.75044H7.44233Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMinistryReport;
