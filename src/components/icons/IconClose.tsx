import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconClose = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-close ${className}`}
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
          id="mask0_2417_11959"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2417_11959)">
          <path
            d="M6.4 19.0005L5 17.6005L10.6 12.0005L5 6.40049L6.4 5.00049L12 10.6005L17.6 5.00049L19 6.40049L13.4 12.0005L19 17.6005L17.6 19.0005L12 13.4005L6.4 19.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconClose;
