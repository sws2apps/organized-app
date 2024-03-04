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
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_20497)">
          <path
            d="M15 20.9621L8.99998 18.8621L4.69615 20.5274C4.40128 20.6415 4.12821 20.6088 3.87692 20.4294C3.62564 20.2499 3.5 20.0044 3.5 19.6928V6.57751C3.5 6.38008 3.55289 6.20284 3.65868 6.04579C3.76444 5.88874 3.91283 5.77496 4.10385 5.70444L8.99998 4.03906L15 6.13906L19.3038 4.47369C19.5987 4.35959 19.8717 4.38747 20.123 4.55734C20.3743 4.7272 20.5 4.9647 20.5 5.26984V18.4621C20.5 18.6659 20.4423 18.8448 20.3269 18.9986C20.2115 19.1525 20.0551 19.2646 19.8576 19.3352L15 20.9621ZM14.25 19.1275V7.42749L9.74995 5.85441V17.5544L14.25 19.1275ZM15.75 19.1275L19 18.0506V6.20056L15.75 7.42749V19.1275ZM4.99997 18.8006L8.25 17.5544V5.85441L4.99997 6.95056V18.8006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMap;
