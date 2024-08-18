import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCopy = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-copy ${className}`}
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
          id="mask0_2821_80963"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2821_80963)">
          <path
            d="M9.05765 17.5004C8.55252 17.5004 8.12496 17.3254 7.77498 16.9754C7.42498 16.6254 7.24998 16.1979 7.24998 15.6927V4.30819C7.24998 3.80306 7.42498 3.37549 7.77498 3.02549C8.12496 2.67549 8.55252 2.50049 9.05765 2.50049H17.4422C17.9473 2.50049 18.3749 2.67549 18.7249 3.02549C19.0749 3.37549 19.2499 3.80306 19.2499 4.30819V15.6927C19.2499 16.1979 19.0749 16.6254 18.7249 16.9754C18.3749 17.3254 17.9473 17.5004 17.4422 17.5004H9.05765ZM9.05765 16.0005H17.4422C17.5191 16.0005 17.5897 15.9684 17.6538 15.9043C17.7179 15.8402 17.7499 15.7697 17.7499 15.6927V4.30819C17.7499 4.23126 17.7179 4.16073 17.6538 4.09661C17.5897 4.03251 17.5191 4.00046 17.4422 4.00046H9.05765C8.98072 4.00046 8.9102 4.03251 8.8461 4.09661C8.78198 4.16073 8.74993 4.23126 8.74993 4.30819V15.6927C8.74993 15.7697 8.78198 15.8402 8.8461 15.9043C8.9102 15.9684 8.98072 16.0005 9.05765 16.0005ZM5.55768 21.0004C5.05256 21.0004 4.625 20.8254 4.275 20.4754C3.925 20.1254 3.75 19.6978 3.75 19.1927V6.30819H5.24998V19.1927C5.24998 19.2696 5.28202 19.3402 5.34613 19.4043C5.41024 19.4684 5.48076 19.5004 5.55768 19.5004H15.4422V21.0004H5.55768Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCopy;
