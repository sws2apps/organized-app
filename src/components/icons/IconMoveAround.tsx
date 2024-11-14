import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMoveAround = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-move-around ${className}`}
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
          id="mask0_4944_2979529"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979529)">
          <path
            d="M10.5303 21.5953C10.0251 21.5953 9.54756 21.4889 9.09756 21.276C8.64756 21.0632 8.27128 20.7574 7.96871 20.3587L2.87451 13.7607L3.24374 13.3665C3.49372 13.0998 3.79275 12.9395 4.14081 12.8857C4.4889 12.8318 4.81485 12.8979 5.11869 13.0838L7.55526 14.3915V6.47995C7.55526 6.26745 7.62717 6.08933 7.77099 5.94558C7.91479 5.80183 8.09299 5.72995 8.30559 5.72995C8.51817 5.72995 8.69882 5.80183 8.84754 5.94558C8.99625 6.08933 9.07061 6.26745 9.07061 6.47995V17.0395L6.06864 15.4049L9.18791 19.4703C9.35203 19.6767 9.55204 19.8325 9.78794 19.9376C10.0238 20.0427 10.2713 20.0953 10.5303 20.0953H15.4495C16.0764 20.0953 16.6097 19.877 17.0495 19.4405C17.4892 19.0039 17.7091 18.4722 17.7091 17.8453V14.0761C17.7091 13.7328 17.593 13.445 17.3608 13.2128C17.1285 12.9806 16.8408 12.8645 16.4975 12.8645H11.4553V11.3646H16.4975C17.2507 11.3646 17.891 11.6282 18.4182 12.1554C18.9454 12.6827 19.2091 13.3229 19.2091 14.0761V17.8446C19.2091 18.881 18.8409 19.7652 18.1047 20.4972C17.3684 21.2293 16.4833 21.5953 15.4495 21.5953H10.5303ZM4.41296 8.72993C4.21553 8.39531 4.0649 8.03751 3.96106 7.65653C3.85721 7.27555 3.80529 6.88335 3.80529 6.47995C3.80529 5.23124 4.2431 4.16906 5.11874 3.29343C5.99437 2.4178 7.05654 1.97998 8.30524 1.97998C9.55395 1.97998 10.6161 2.4178 11.4918 3.29343C12.3674 4.16906 12.8052 5.23083 12.8052 6.47873C12.8052 6.88466 12.7533 7.2777 12.6494 7.65783C12.5456 8.03795 12.395 8.39531 12.1975 8.72993L10.9052 7.97996C11.0386 7.74662 11.1386 7.50912 11.2052 7.26746C11.2719 7.02579 11.3052 6.76329 11.3052 6.47995C11.3052 5.64662 11.0136 4.93829 10.4302 4.35495C9.8469 3.77162 9.13857 3.47995 8.30524 3.47995C7.4719 3.47995 6.76357 3.77162 6.18024 4.35495C5.5969 4.93829 5.30524 5.64662 5.30524 6.47995C5.30524 6.76329 5.33857 7.02579 5.40524 7.26746C5.4719 7.50912 5.5719 7.74662 5.70524 7.97996L4.41296 8.72993Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMoveAround;