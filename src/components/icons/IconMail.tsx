import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMail = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-mail ${className}`}
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
          id="mask0_2633_30394"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2633_30394)">
          <path
            d="M4.3077 19.5004C3.80257 19.5004 3.375 19.3254 3.025 18.9754C2.675 18.6254 2.5 18.1979 2.5 17.6927V6.30819C2.5 5.80306 2.675 5.37549 3.025 5.02549C3.375 4.67549 3.80257 4.50049 4.3077 4.50049H19.6923C20.1974 4.50049 20.625 4.67549 20.975 5.02549C21.325 5.37549 21.5 5.80306 21.5 6.30819V17.6927C21.5 18.1979 21.325 18.6254 20.975 18.9754C20.625 19.3254 20.1974 19.5004 19.6923 19.5004H4.3077ZM12 12.5581L3.99998 7.44274V17.6927C3.99998 17.7825 4.02883 17.8562 4.08653 17.9139C4.14423 17.9716 4.21795 18.0005 4.3077 18.0005H19.6923C19.782 18.0005 19.8557 17.9716 19.9134 17.9139C19.9711 17.8562 20 17.7825 20 17.6927V7.44274L12 12.5581ZM12 11.0005L19.8461 6.00046H4.15383L12 11.0005ZM3.99998 7.44274V6.00046V17.6927C3.99998 17.7825 4.02883 17.8562 4.08653 17.9139C4.14423 17.9716 4.21795 18.0005 4.3077 18.0005H3.99998V7.44274Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMail;
