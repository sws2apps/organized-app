import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPioneerForm = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-pioneer-form" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2651_27808"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2651_27808)">
          <path d="M8 16.7221V15.3711H13.5087V16.7221H8ZM8 13.3515V12.0005H16.6468V13.3515H8Z" fill={color} />
          <path
            d="M13.8269 21.5004V18.8581L19.2557 13.4543C19.3801 13.3364 19.5143 13.2505 19.6585 13.1966C19.8026 13.1428 19.9468 13.1159 20.091 13.1159C20.2482 13.1159 20.4003 13.1453 20.5473 13.2043C20.6942 13.2633 20.8278 13.3518 20.948 13.4697L21.873 14.4043C21.9807 14.5287 22.064 14.6633 22.123 14.8081C22.182 14.953 22.2115 15.0979 22.2115 15.2428C22.2115 15.3876 22.1845 15.5351 22.1307 15.6851C22.0769 15.8351 21.991 15.9722 21.873 16.0966L16.4692 21.5004H13.8269ZM15.0192 20.3081H15.9692L19.2154 17.0466L18.7654 16.5617L18.2904 16.1024L15.0192 19.3581V20.3081ZM6.3077 21.5004C5.80257 21.5004 5.375 21.3254 5.025 20.9754C4.675 20.6254 4.5 20.1979 4.5 19.6927V4.30819C4.5 3.80306 4.675 3.37549 5.025 3.02549C5.375 2.67549 5.80257 2.50049 6.3077 2.50049H14.25L19.5 7.75044V10.5485H18V8.50044H13.5V4.00046H6.3077C6.23077 4.00046 6.16024 4.03251 6.09612 4.09661C6.03202 4.16073 5.99997 4.23126 5.99997 4.30819V19.6927C5.99997 19.7697 6.03202 19.8402 6.09612 19.9043C6.16024 19.9684 6.23077 20.0005 6.3077 20.0005H11.6346V21.5004H6.3077ZM18.7654 16.5617L18.2904 16.1024L19.2154 17.0466L18.7654 16.5617Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPioneerForm;
