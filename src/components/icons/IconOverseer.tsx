import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconOverseer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-overseer ${className}`}
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
          id="mask0_3106_63388"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3106_63388)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.21153 19.5004L12 22.2888L14.7884 19.5004H18.6923C19.1974 19.5004 19.625 19.3254 19.975 18.9754C20.325 18.6254 20.5 18.1979 20.5 17.6927V4.30819C20.5 3.80305 20.325 3.37549 19.975 3.02549C19.625 2.67549 19.1974 2.50049 18.6923 2.50049H5.3077C4.80257 2.50049 4.375 2.67549 4.025 3.02549C3.675 3.37549 3.5 3.80305 3.5 4.30819V17.6927C3.5 18.1979 3.675 18.6254 4.025 18.9754C4.375 19.3254 4.80257 19.5004 5.3077 19.5004H9.21153ZM5 17.0427C4.99999 17.0427 4.99998 17.0428 4.99997 17.0428V4.30816C4.99997 4.30692 4.99998 4.30568 5 4.30444V4.30043C5 4.13474 5.13431 4.00043 5.3 4.00043H18.7C18.8657 4.00043 19 4.13474 19 4.30043V17.7004C19 17.8661 18.8657 18.0004 18.7 18.0004H17.5577V18.0004H6.44225V18.0004H5.3C5.13431 18.0004 5 17.8661 5 17.7004L5 17.0427Z"
            fill={color}
          />
          <path
            d="M12 6.00049L13.3505 9.65003L17 11.0005L13.3505 12.3509L12 16.0005L10.6495 12.3509L7 11.0005L10.6495 9.65003L12 6.00049Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconOverseer;
