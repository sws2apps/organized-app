import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMap = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-map ${className}`}
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
          id="mask0_2457_20497"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_20497)">
          <path
            d="M15 20.4621L8.99998 18.3621L4.69615 20.0274C4.40128 20.1415 4.12821 20.1088 3.87692 19.9294C3.62564 19.7499 3.5 19.5044 3.5 19.1928V6.07751C3.5 5.88008 3.55289 5.70284 3.65868 5.54579C3.76444 5.38874 3.91283 5.27496 4.10385 5.20444L8.99998 3.53906L15 5.63906L19.3038 3.97369C19.5987 3.85959 19.8717 3.88747 20.123 4.05734C20.3743 4.2272 20.5 4.4647 20.5 4.76984V17.9621C20.5 18.1659 20.4423 18.3448 20.3269 18.4986C20.2115 18.6525 20.0551 18.7646 19.8576 18.8352L15 20.4621ZM14.25 18.6275V6.92749L9.74995 5.35441V17.0544L14.25 18.6275ZM15.75 18.6275L19 17.5506V5.70056L15.75 6.92749V18.6275ZM4.99997 18.3006L8.25 17.0544V5.35441L4.99997 6.45056V18.3006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMap;
