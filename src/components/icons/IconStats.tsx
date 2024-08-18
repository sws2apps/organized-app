import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconStats = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-stats ${className}`}
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
          id="mask0_2457_20498"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_20498)">
          <path
            d="M7.39997 21.6543L6.34615 20.6005L12.9 14.0313L16.4 17.5313L21.575 12.3563L22.6442 13.4255L16.4 19.6543L12.9 16.1543L7.39997 21.6543ZM4.3077 20.5004C3.80257 20.5004 3.375 20.3254 3.025 19.9754C2.675 19.6254 2.5 19.1979 2.5 18.6927V5.30819C2.5 4.80306 2.675 4.37549 3.025 4.02549C3.375 3.67549 3.80257 3.50049 4.3077 3.50049H17.6923C18.1974 3.50049 18.625 3.67549 18.975 4.02549C19.325 4.37549 19.5 4.80306 19.5 5.30819V9.50819H3.99998V18.6927C3.99998 18.7697 4.03202 18.8402 4.09612 18.9043C4.16024 18.9684 4.23077 19.0005 4.3077 19.0005V20.5004ZM3.99998 8.00821H18V5.30819C18 5.23126 17.9679 5.16073 17.9038 5.09661C17.8397 5.03251 17.7692 5.00046 17.6923 5.00046H4.3077C4.23077 5.00046 4.16024 5.03251 4.09612 5.09661C4.03202 5.16073 3.99998 5.23126 3.99998 5.30819V8.00821Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconStats;
