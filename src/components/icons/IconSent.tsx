import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSent = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-sent ${className}`}
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
          id="mask0_2936_42672"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2936_42672)">
          <path
            d="M15.7192 21.635L11.8154 17.7313L12.8692 16.6774L15.7192 19.5274L21.3884 13.8582L22.4423 14.912L15.7192 21.635ZM12 11.0005L19.8461 6.00046H4.15383L12 11.0005ZM12 12.5581L3.99998 7.44274V17.6927C3.99998 17.7825 4.02883 17.8562 4.08653 17.9139C4.14423 17.9716 4.21795 18.0005 4.3077 18.0005H9.27498L10.775 19.5004H4.3077C3.80257 19.5004 3.375 19.3254 3.025 18.9754C2.675 18.6254 2.5 18.1979 2.5 17.6927V6.30819C2.5 5.80306 2.675 5.37549 3.025 5.02549C3.375 4.67549 3.80257 4.50049 4.3077 4.50049H19.6923C20.1974 4.50049 20.625 4.67549 20.975 5.02549C21.325 5.37549 21.5 5.80306 21.5 6.30819V10.9467L20 12.4466V7.44274L12 12.5581Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSent;
