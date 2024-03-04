import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconUnpin = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-unpin" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4270_20763"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4270_20763)">
          <rect
            x="3.40869"
            y="4.37158"
            width="1.595"
            height="22.7216"
            transform="rotate(-44.9531 3.40869 4.37158)"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.1708 8.91269L8.74423 10.4178L6.21591 10.4855L5.18403 11.5741L8.47792 14.6963L4.69434 18.688L4.7227 19.7483L5.78297 19.7199L9.56654 15.7281L12.8604 18.8502L13.8923 17.7616L13.8246 15.2333L15.1184 13.8683L14.0582 12.8064L12.2968 14.6648L12.3403 16.2905L7.76791 11.9566L9.39367 11.913L11.231 9.9746L10.1708 8.91269ZM15.1559 11.6484L17.697 8.9674L14.7939 6.21568L12.3287 8.81655L11.2685 7.75463L13.7053 5.1838L12.9795 4.49587L14.0114 3.40723L20.5433 9.59856L19.5115 10.6872L18.7857 9.99928L16.216 12.7103L15.1559 11.6484Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUnpin;
