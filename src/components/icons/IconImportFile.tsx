import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconImportFile = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-import-file ${className}`}
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
          id="mask0_2513_2694"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2694)">
          <path
            d="M11.25 18.385H12.7499V13.9504L14.6 15.8004L15.6538 14.7312L12 11.0774L8.34615 14.7312L9.41535 15.785L11.25 13.9504V18.385ZM6.3077 21.5004C5.80257 21.5004 5.375 21.3254 5.025 20.9754C4.675 20.6254 4.5 20.1979 4.5 19.6927V4.30819C4.5 3.80306 4.675 3.37549 5.025 3.02549C5.375 2.67549 5.80257 2.50049 6.3077 2.50049H14.25L19.5 7.75044V19.6927C19.5 20.1979 19.325 20.6254 18.975 20.9754C18.625 21.3254 18.1974 21.5004 17.6922 21.5004H6.3077ZM13.5 8.50044V4.00046H6.3077C6.23077 4.00046 6.16024 4.03251 6.09612 4.09661C6.03202 4.16073 5.99997 4.23126 5.99997 4.30819V19.6927C5.99997 19.7697 6.03202 19.8402 6.09612 19.9043C6.16024 19.9684 6.23077 20.0005 6.3077 20.0005H17.6922C17.7692 20.0005 17.8397 19.9684 17.9038 19.9043C17.9679 19.8402 18 19.7697 18 19.6927V8.50044H13.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImportFile;
