import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconManageAccess = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-manage-access" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_23643"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_23643)">
          <path
            d="M10.7404 14.7499H13.2596L12.6942 11.5923C13.0083 11.4576 13.2612 11.2464 13.4528 10.9586C13.6445 10.6708 13.7403 10.3512 13.7403 9.99995C13.7403 9.52047 13.5702 9.11054 13.2298 8.77015C12.8894 8.42977 12.4795 8.25958 12 8.25958C11.5205 8.25958 11.1106 8.42977 10.7702 8.77015C10.4298 9.11054 10.2596 9.52047 10.2596 9.99995C10.2596 10.3512 10.3554 10.6708 10.5471 10.9586C10.7388 11.2464 10.9916 11.4576 11.3057 11.5923L10.7404 14.7499ZM12 21.4807C9.83716 20.8909 8.04646 19.6179 6.62787 17.6615C5.20929 15.7051 4.5 13.5179 4.5 11.1V5.34613L12 2.53845L19.5 5.34613V11.1C19.5 13.5179 18.7907 15.7051 17.3721 17.6615C15.9535 19.6179 14.1628 20.8909 12 21.4807ZM12 19.9C13.7333 19.35 15.1666 18.25 16.3 16.6C17.4333 14.95 18 13.1166 18 11.1V6.37495L12 4.13458L5.99997 6.37495V11.1C5.99997 13.1166 6.56664 14.95 7.69997 16.6C8.83331 18.25 10.2666 19.35 12 19.9Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconManageAccess;
