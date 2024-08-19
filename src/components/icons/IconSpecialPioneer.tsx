import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSpecialPioneer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-special-pioneer ${className}`}
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
          id="mask0_3298_119084"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119084)">
          <path
            d="M9.2964 15.9045L12.0002 14.2642L14.7041 15.9045L13.9868 12.8296L16.3848 10.7623L13.2291 10.4969L12.0002 7.59689L10.7714 10.4969L7.61563 10.7623L10.0137 12.8296L9.2964 15.9045ZM12.0002 22.6084L8.86178 19.5007H4.50025V15.1392L1.39258 12.0007L4.50025 8.86227V4.50074H8.86178L12.0002 1.39307L15.1387 4.50074H19.5002V8.86227L22.6079 12.0007L19.5002 15.1392V19.5007H15.1387L12.0002 22.6084ZM12.0002 20.5007L14.5002 18.0007H18.0002V14.5007L20.5002 12.0007L18.0002 9.50072V6.00072H14.5002L12.0002 3.50072L9.50023 6.00072H6.00023V9.50072L3.50023 12.0007L6.00023 14.5007V18.0007H9.50023L12.0002 20.5007Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSpecialPioneer;
