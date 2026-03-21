import { SvgIcon, SxProps, Theme, useTheme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconChevronLeft = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  const theme = useTheme();
  return (
    <SvgIcon
      className={`organized-icon-chevron_left ${className}`}
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
        ...sx,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_4921_2977714"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4921_2977714)">
          <path
            d="M14 18.0005L8 12.0005L14 6.00049L15.4 7.40049L10.8 12.0005L15.4 16.6005L14 18.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconChevronLeft;
