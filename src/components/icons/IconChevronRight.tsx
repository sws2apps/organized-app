import { SvgIcon, SxProps, Theme, useTheme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconChevronRight = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  const theme = useTheme();
  return (
    <SvgIcon
      className={`organized-icon-chevron_right ${className}`}
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
          id="mask0_4921_2977713"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4921_2977713)">
          <path
            d="M12.6 12.0005L8 7.40049L9.4 6.00049L15.4 12.0005L9.4 18.0005L8 16.6005L12.6 12.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconChevronRight;
