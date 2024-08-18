import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconOnCircle = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-on-circle ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <g clipPath="url(#clip0_4449_152176)">
          <path
            d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z"
            fill="#FEFEFE"
          />
          <mask
            id="mask0_4449_152176"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="18"
            height="18"
          >
            <rect width="18" height="18" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_4449_152176)">
            <path
              d="M7.41898 13L4 9.60494L5.47535 8.13992L7.41898 10.0699L12.5247 5L14 6.46503L7.41898 13Z"
              fill={color}
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4449_152176">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
};

export default IconOnCircle;
