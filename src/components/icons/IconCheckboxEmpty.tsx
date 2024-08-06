import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCheckboxEmpty = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-checkbox-empty"
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
          id="mask0_2704_41497"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_41497)">
          <path
            d="M5.3077 20.5004C4.80257 20.5004 4.375 20.3254 4.025 19.9754C3.675 19.6254 3.5 19.1979 3.5 18.6927V5.30819C3.5 4.80306 3.675 4.37549 4.025 4.02549C4.375 3.67549 4.80257 3.50049 5.3077 3.50049H18.6923C19.1974 3.50049 19.625 3.67549 19.975 4.02549C20.325 4.37549 20.5 4.80306 20.5 5.30819V18.6927C20.5 19.1979 20.325 19.6254 19.975 19.9754C19.625 20.3254 19.1974 20.5004 18.6923 20.5004H5.3077ZM5.3077 19.0005H18.6923C18.7692 19.0005 18.8397 18.9684 18.9038 18.9043C18.9679 18.8402 19 18.7697 19 18.6927V5.30819C19 5.23126 18.9679 5.16073 18.9038 5.09661C18.8397 5.03251 18.7692 5.00046 18.6923 5.00046H5.3077C5.23077 5.00046 5.16024 5.03251 5.09612 5.09661C5.03202 5.16073 4.99997 5.23126 4.99997 5.30819V18.6927C4.99997 18.7697 5.03202 18.8402 5.09612 18.9043C5.16024 18.9684 5.23077 19.0005 5.3077 19.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCheckboxEmpty;
