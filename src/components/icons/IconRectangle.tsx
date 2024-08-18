import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRectangle = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-rectangle ${className}`}
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
          id="mask0_4944_2981232"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2981232)">
          <path
            d="M5.3077 20.5004C4.80257 20.5004 4.375 20.3254 4.025 19.9754C3.675 19.6254 3.5 19.1979 3.5 18.6927V5.30819C3.5 4.80306 3.675 4.37549 4.025 4.02549C4.375 3.67549 4.80257 3.50049 5.3077 3.50049H18.6923C19.1974 3.50049 19.625 3.67549 19.975 4.02549C20.325 4.37549 20.5 4.80306 20.5 5.30819V18.6927C20.5 19.1979 20.325 19.6254 19.975 19.9754C19.625 20.3254 19.1974 20.5004 18.6923 20.5004H5.3077ZM5.3077 19.0005H18.6923C18.782 19.0005 18.8557 18.9716 18.9134 18.9139C18.9711 18.8562 19 18.7825 19 18.6927V5.30819C19 5.21844 18.9711 5.14471 18.9134 5.08701C18.8557 5.02931 18.782 5.00046 18.6923 5.00046H5.3077C5.21795 5.00046 5.14423 5.02931 5.08653 5.08701C5.02883 5.14471 4.99997 5.21844 4.99997 5.30819V18.6927C4.99997 18.7825 5.02883 18.8562 5.08653 18.9139C5.14423 18.9716 5.21795 19.0005 5.3077 19.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRectangle;
