import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconAuxiliaryPioneer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-auxiliary-pioneer ${className}`}
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
          id="mask0_3298_119083"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119083)">
          <path
            d="M6.69248 22.5004V14.9101L3.35596 9.50046L7.67323 2.50049H16.327L20.6443 9.50046L17.3078 14.9101V22.5004L12.0001 20.7024L6.69248 22.5004ZM8.19246 20.3793L12.0001 19.112L15.8078 20.3793V16.5004H8.19246V20.3793ZM8.50976 4.00046L5.10976 9.50046L8.50976 15.0005H15.4905L18.8905 9.50046L15.4905 4.00046H8.50976ZM10.9501 13.2197L7.75593 10.0505L8.82513 8.98126L10.9501 11.1063L15.1751 6.85626L16.2443 7.90046L10.9501 13.2197Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAuxiliaryPioneer;
