import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconMap = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-map" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2457_20497"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_20497)">
          <path
            d="M15 20.4615L8.99998 18.3615L4.69615 20.0268C4.40128 20.1409 4.12821 20.1082 3.87692 19.9288C3.62564 19.7493 3.5 19.5038 3.5 19.1922V6.0769C3.5 5.87947 3.55289 5.70223 3.65868 5.54518C3.76444 5.38813 3.91283 5.27435 4.10385 5.20383L8.99998 3.53845L15 5.63845L19.3038 3.97308C19.5987 3.85898 19.8717 3.88686 20.123 4.05673C20.3743 4.22659 20.5 4.46409 20.5 4.76923V17.9615C20.5 18.1653 20.4423 18.3442 20.3269 18.498C20.2115 18.6519 20.0551 18.764 19.8576 18.8346L15 20.4615ZM14.25 18.6269V6.92688L9.74995 5.3538V17.0538L14.25 18.6269ZM15.75 18.6269L19 17.55V5.69995L15.75 6.92688V18.6269ZM4.99997 18.3L8.25 17.0538V5.3538L4.99997 6.44995V18.3Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMap;
