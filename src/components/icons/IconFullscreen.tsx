import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFullscreen = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-fullscreen ${className}`}
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
          id="mask0_4944_2980247"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980247)">
          <path
            d="M3.00049 21.0621V13.5621H4.50049V18.5084L10 13L11.0538 14.0538L5.55424 19.5621H10.5005V21.0621H3.00049Z"
            fill={color}
          />
          <path
            d="M12.9462 9.94625L14 11L19.4996 5.49174V10.438H20.9996V2.93799H13.4996V4.43799H18.4459L12.9462 9.94625Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFullscreen;
