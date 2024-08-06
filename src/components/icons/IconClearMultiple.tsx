import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconClearMultiple = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-clear-multiple"
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
          id="mask0_3251_160506"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3251_160506)">
          <path
            d="M11.6499 13.1447L13.7499 11.0447L15.8499 13.1447L16.8941 12.1005L14.7941 10.0005L16.8941 7.90046L15.8499 6.85626L13.7499 8.95626L11.6499 6.85626L10.6057 7.90046L12.7057 10.0005L10.6057 12.1005L11.6499 13.1447ZM8.05765 17.5004C7.55252 17.5004 7.12496 17.3254 6.77498 16.9754C6.42498 16.6254 6.24998 16.1979 6.24998 15.6927V4.30819C6.24998 3.80306 6.42498 3.37549 6.77498 3.02549C7.12496 2.67549 7.55252 2.50049 8.05765 2.50049H19.4422C19.9473 2.50049 20.3749 2.67549 20.7249 3.02549C21.0749 3.37549 21.2499 3.80306 21.2499 4.30819V15.6927C21.2499 16.1979 21.0749 16.6254 20.7249 16.9754C20.3749 17.3254 19.9473 17.5004 19.4422 17.5004H8.05765ZM8.05765 16.0005H19.4422C19.5191 16.0005 19.5897 15.9684 19.6538 15.9043C19.7179 15.8402 19.7499 15.7697 19.7499 15.6927V4.30819C19.7499 4.23126 19.7179 4.16073 19.6538 4.09661C19.5897 4.03251 19.5191 4.00046 19.4422 4.00046H8.05765C7.98072 4.00046 7.9102 4.03251 7.8461 4.09661C7.78198 4.16073 7.74993 4.23126 7.74993 4.30819V15.6927C7.74993 15.7697 7.78198 15.8402 7.8461 15.9043C7.9102 15.9684 7.98072 16.0005 8.05765 16.0005ZM4.55768 21.0004C4.05256 21.0004 3.625 20.8254 3.275 20.4754C2.925 20.1254 2.75 19.6978 2.75 19.1927V6.30819H4.24998V19.1927C4.24998 19.2696 4.28202 19.3402 4.34613 19.4043C4.41024 19.4684 4.48076 19.5004 4.55768 19.5004H17.4422V21.0004H4.55768Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconClearMultiple;
