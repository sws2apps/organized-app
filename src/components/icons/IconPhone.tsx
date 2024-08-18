import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPhone = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-phone ${className}`}
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
          id="mask0_2704_31559"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_31559)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.025 21.9754C6.375 22.3254 6.80257 22.5004 7.3077 22.5004L16.6922 22.5004C17.1974 22.5004 17.625 22.3254 17.975 21.9754C18.325 21.6254 18.5 21.1979 18.5 20.6927V3.30819C18.5 2.80306 18.325 2.37549 17.975 2.02549C17.625 1.67549 17.1974 1.50049 16.6922 1.50049H7.3077C6.80257 1.50049 6.375 1.67549 6.025 2.02549C5.675 2.37549 5.5 2.80306 5.5 3.30819V20.6927C5.5 21.1979 5.675 21.6254 6.025 21.9754ZM6.99997 20.6928V19.7505H7V18.2505H6.99997V5.75046H7V4.25051H6.99997V3.30821C6.99997 3.23128 7.03202 3.16076 7.09613 3.09664C7.16024 3.03254 7.23077 3.00049 7.3077 3.00049H16.6922C16.7692 3.00049 16.8397 3.03254 16.9038 3.09664C16.9679 3.16076 17 3.23128 17 3.30821V4.00049H17V20.0005H17V20.6928C17 20.7697 16.9679 20.8402 16.9038 20.9043C16.8397 20.9684 16.7692 21.0005 16.6922 21.0005H7.3077C7.23077 21.0005 7.16024 20.9684 7.09613 20.9043C7.03202 20.8402 6.99997 20.7697 6.99997 20.6928Z"
            fill={color}
          />
          <rect x="9" y="19.0005" width="6" height="1" rx="0.5" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPhone;
