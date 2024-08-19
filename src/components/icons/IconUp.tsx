import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconUp = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-up ${className}`}
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
          id="mask0_8476_225431"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_8476_225431)">
          <path
            d="M6.35613 10.9909L12.0003 5.34668L17.6445 10.9909L16.6003 12.0351L12.7503 8.21968L12.7503 18.6543L11.2504 18.6543L11.2504 8.21008L7.40033 12.0601L6.35613 10.9909Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUp;
