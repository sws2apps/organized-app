import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconComputer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-computer ${className}`}
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
          id="mask0_2704_31558"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_31558)">
          <path
            d="M8.5 20.5004V19.0005H10.5V17.0005H4.3077C3.80257 17.0005 3.375 16.8255 3.025 16.4755C2.675 16.1255 2.5 15.6979 2.5 15.1928V5.30819C2.5 4.80306 2.675 4.37549 3.025 4.02549C3.375 3.67549 3.80257 3.50049 4.3077 3.50049H19.6923C20.1974 3.50049 20.625 3.67549 20.975 4.02549C21.325 4.37549 21.5 4.80306 21.5 5.30819V15.1928C21.5 15.6979 21.325 16.1255 20.975 16.4755C20.625 16.8255 20.1974 17.0005 19.6923 17.0005H13.5V19.0005H15.5V20.5004H8.5ZM4.3077 15.5005H19.6923C19.7692 15.5005 19.8397 15.4684 19.9038 15.4043C19.9679 15.3402 20 15.2697 20 15.1928V5.30819C20 5.23126 19.9679 5.16073 19.9038 5.09661C19.8397 5.03251 19.7692 5.00046 19.6923 5.00046H4.3077C4.23077 5.00046 4.16024 5.03251 4.09613 5.09661C4.03202 5.16073 3.99998 5.23126 3.99998 5.30819V15.1928C3.99998 15.2697 4.03202 15.3402 4.09613 15.4043C4.16024 15.4684 4.23077 15.5005 4.3077 15.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconComputer;
