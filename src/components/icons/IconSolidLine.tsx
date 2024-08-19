import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSolidLine = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-solid-line ${className}`}
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
          id="mask0_4944_2979630"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979630)">
          <path
            d="M18 20.0005C18 18.0671 17.6333 16.2505 16.9 14.5505C16.1667 12.8505 15.1667 11.3671 13.9 10.1005C12.6333 8.8338 11.15 7.8338 9.45 7.10046C7.75 6.36713 5.93333 6.00046 4 6.00046V4.50049C6.1359 4.50049 8.14422 4.90691 10.025 5.71974C11.9057 6.53256 13.5487 7.64152 14.9538 9.04664C16.3589 10.4518 17.4679 12.0947 18.2807 13.9755C19.0936 15.8562 19.5 17.8646 19.5 20.0005H18Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSolidLine;
