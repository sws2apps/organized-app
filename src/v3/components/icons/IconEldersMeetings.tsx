import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconEldersMeetings = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-elders-meetings" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5230_181686"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5230_181686)">
          <path
            d="M4.3077 21.0004C3.80257 21.0004 3.375 20.8254 3.025 20.4754C2.675 20.1254 2.5 19.6978 2.5 19.1927V8.80814C2.5 8.30301 2.675 7.87544 3.025 7.52544C3.375 7.17544 3.80257 7.00044 4.3077 7.00044H8.5V5.30816C8.5 4.80305 8.675 4.37549 9.025 4.02549C9.375 3.67549 9.80257 3.50049 10.3077 3.50049H13.6923C14.1974 3.50049 14.625 3.67549 14.975 4.02549C15.325 4.37549 15.5 4.80305 15.5 5.30816V7.00044H19.6923C20.1974 7.00044 20.625 7.17544 20.975 7.52544C21.325 7.87544 21.5 8.30301 21.5 8.80814V19.1927C21.5 19.6978 21.325 20.1254 20.975 20.4754C20.625 20.8254 20.1974 21.0004 19.6923 21.0004H4.3077ZM9.99998 7.00044H14V5.30816C14 5.23123 13.9679 5.16071 13.9038 5.09661C13.8397 5.0325 13.7692 5.00044 13.6923 5.00044H10.3077C10.2308 5.00044 10.1602 5.0325 10.0961 5.09661C10.032 5.16071 9.99998 5.23123 9.99998 5.30816V7.00044ZM20 15.2504H14.5V17.0004H9.5V15.2504H3.99998V19.1927C3.99998 19.2696 4.03202 19.3401 4.09613 19.4043C4.16024 19.4684 4.23077 19.5004 4.3077 19.5004H19.6923C19.7692 19.5004 19.8397 19.4684 19.9038 19.4043C19.9679 19.3401 20 19.2696 20 19.1927V15.2504ZM11 15.5004H13V13.5004H11V15.5004ZM3.99998 13.7504H9.5V12.0004H14.5V13.7504H20V8.80814C20 8.73121 19.9679 8.66068 19.9038 8.59656C19.8397 8.53246 19.7692 8.50041 19.6923 8.50041H4.3077C4.23077 8.50041 4.16024 8.53246 4.09613 8.59656C4.03202 8.66068 3.99998 8.73121 3.99998 8.80814V13.7504Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconEldersMeetings;
