import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconUnpin = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-unpin ${className}`}
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
          id="mask0_4270_20763"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4270_20763)">
          <rect
            x="3.40869"
            y="3.87158"
            width="1.595"
            height="22.7216"
            transform="rotate(-44.9531 3.40869 3.87158)"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.1708 8.41269L8.74423 9.91778L6.21591 9.98549L5.18403 11.0741L8.47792 14.1963L4.69434 18.188L4.7227 19.2483L5.78297 19.2199L9.56654 15.2281L12.8604 18.3502L13.8923 17.2616L13.8246 14.7333L15.1184 13.3683L14.0582 12.3064L12.2968 14.1648L12.3403 15.7905L7.76791 11.4566L9.39367 11.413L11.231 9.4746L10.1708 8.41269ZM15.1559 11.1484L17.697 8.4674L14.7939 5.71568L12.3287 8.31655L11.2685 7.25463L13.7053 4.6838L12.9795 3.99587L14.0114 2.90723L20.5433 9.09856L19.5115 10.1872L18.7857 9.49928L16.216 12.2103L15.1559 11.1484Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUnpin;
