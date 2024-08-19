import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconManageAccess = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-manage-access ${className}`}
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
          id="mask0_2515_23643"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_23643)">
          <path
            d="M10.7404 14.7505H13.2596L12.6942 11.5929C13.0083 11.4582 13.2612 11.247 13.4528 10.9592C13.6445 10.6714 13.7403 10.3518 13.7403 10.0006C13.7403 9.52108 13.5702 9.11115 13.2298 8.77076C12.8894 8.43038 12.4795 8.26019 12 8.26019C11.5205 8.26019 11.1106 8.43038 10.7702 8.77076C10.4298 9.11115 10.2596 9.52108 10.2596 10.0006C10.2596 10.3518 10.3554 10.6714 10.5471 10.9592C10.7388 11.247 10.9916 11.4582 11.3057 11.5929L10.7404 14.7505ZM12 21.4813C9.83716 20.8916 8.04646 19.6185 6.62787 17.6621C5.20929 15.7057 4.5 13.5185 4.5 11.1006V5.34674L12 2.53906L19.5 5.34674V11.1006C19.5 13.5185 18.7907 15.7057 17.3721 17.6621C15.9535 19.6185 14.1628 20.8916 12 21.4813ZM12 19.9006C13.7333 19.3506 15.1666 18.2506 16.3 16.6006C17.4333 14.9506 18 13.1172 18 11.1006V6.37556L12 4.13519L5.99997 6.37556V11.1006C5.99997 13.1172 6.56664 14.9506 7.69997 16.6006C8.83331 18.2506 10.2666 19.3506 12 19.9006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconManageAccess;
