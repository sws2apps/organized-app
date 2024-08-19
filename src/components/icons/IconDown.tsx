import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDown = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-down ${className}`}
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
          id="mask0_8476_229810"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_8476_229810)">
          <path
            d="M17.6444 13.0101L12.0002 18.6543L6.35596 13.0101L7.40016 11.9659L11.2502 15.7813L11.2502 5.34664L12.7501 5.34664L12.7501 15.7909L16.6002 11.9409L17.6444 13.0101Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDown;
