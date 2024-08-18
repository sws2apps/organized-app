import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCalendarMonth = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-calendar-month ${className}`}
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
          id="mask0_4752_166024"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4752_166024)">
          <path
            d="M5.3077 21.5006C4.80257 21.5006 4.375 21.3256 4.025 20.9756C3.675 20.6256 3.5 20.198 3.5 19.6929V6.30833C3.5 5.8032 3.675 5.37563 4.025 5.02563C4.375 4.67563 4.80257 4.50063 5.3077 4.50063H6.69233V2.38525H8.23075V4.50063H15.8077V2.38525H17.3076V4.50063H18.6923C19.1974 4.50063 19.625 4.67563 19.975 5.02563C20.325 5.37563 20.5 5.8032 20.5 6.30833V19.6929C20.5 20.198 20.325 20.6256 19.975 20.9756C19.625 21.3256 19.1974 21.5006 18.6923 21.5006H5.3077ZM5.3077 20.0006H18.6923C18.7692 20.0006 18.8397 19.9686 18.9038 19.9045C18.9679 19.8403 19 19.7698 19 19.6929V10.3083H4.99997V19.6929C4.99997 19.7698 5.03202 19.8403 5.09612 19.9045C5.16024 19.9686 5.23077 20.0006 5.3077 20.0006ZM4.99997 8.80835H19V6.30833C19 6.2314 18.9679 6.16087 18.9038 6.09675C18.8397 6.03265 18.7692 6.0006 18.6923 6.0006H5.3077C5.23077 6.0006 5.16024 6.03265 5.09612 6.09675C5.03202 6.16087 4.99997 6.2314 4.99997 6.30833V8.80835Z"
            fill={color}
          />
          <path
            d="M7.55455 13.7874C7.72698 13.9598 7.93563 14.0461 8.1805 14.0461C8.42537 14.0461 8.63402 13.9598 8.80645 13.7874C8.97888 13.615 9.0651 13.4063 9.0651 13.1615C9.0651 12.9166 8.97888 12.7079 8.80645 12.5355C8.63402 12.3631 8.42537 12.2769 8.1805 12.2769C7.93563 12.2769 7.72698 12.3631 7.55455 12.5355C7.38212 12.7079 7.2959 12.9166 7.2959 13.1615C7.2959 13.4063 7.38212 13.615 7.55455 13.7874Z"
            fill={color}
          />
          <path
            d="M11.5545 13.7874C11.727 13.9598 11.9356 14.0461 12.1805 14.0461C12.4254 14.0461 12.634 13.9598 12.8064 13.7874C12.9789 13.615 13.0651 13.4063 13.0651 13.1615C13.0651 12.9166 12.9789 12.7079 12.8064 12.5355C12.634 12.3631 12.4254 12.2769 12.1805 12.2769C11.9356 12.2769 11.727 12.3631 11.5545 12.5355C11.3821 12.7079 11.2959 12.9166 11.2959 13.1615C11.2959 13.4063 11.3821 13.615 11.5545 13.7874Z"
            fill={color}
          />
          <path
            d="M15.5545 13.7874C15.727 13.9598 15.9356 14.0461 16.1805 14.0461C16.4254 14.0461 16.634 13.9598 16.8064 13.7874C16.9789 13.615 17.0651 13.4063 17.0651 13.1615C17.0651 12.9166 16.9789 12.7079 16.8064 12.5355C16.634 12.3631 16.4254 12.2769 16.1805 12.2769C15.9356 12.2769 15.727 12.3631 15.5545 12.5355C15.3821 12.7079 15.2959 12.9166 15.2959 13.1615C15.2959 13.4063 15.3821 13.615 15.5545 13.7874Z"
            fill={color}
          />
          <path
            d="M7.58043 17.2952C7.75286 17.4677 7.96151 17.5539 8.20638 17.5539C8.45124 17.5539 8.65989 17.4677 8.83233 17.2952C9.00476 17.1228 9.09098 16.9141 9.09098 16.6693C9.09098 16.4244 9.00476 16.2158 8.83233 16.0433C8.65989 15.8709 8.45124 15.7847 8.20638 15.7847C7.96151 15.7847 7.75286 15.8709 7.58043 16.0433C7.40799 16.2158 7.32178 16.4244 7.32178 16.6693C7.32178 16.9141 7.40799 17.1228 7.58043 17.2952Z"
            fill={color}
          />
          <path
            d="M11.5804 17.2952C11.7529 17.4677 11.9615 17.5539 12.2064 17.5539C12.4512 17.5539 12.6599 17.4677 12.8323 17.2952C13.0048 17.1228 13.091 16.9141 13.091 16.6693C13.091 16.4244 13.0048 16.2158 12.8323 16.0433C12.6599 15.8709 12.4512 15.7847 12.2064 15.7847C11.9615 15.7847 11.7529 15.8709 11.5804 16.0433C11.408 16.2158 11.3218 16.4244 11.3218 16.6693C11.3218 16.9141 11.408 17.1228 11.5804 17.2952Z"
            fill={color}
          />
          <path
            d="M15.5804 17.2952C15.7529 17.4677 15.9615 17.5539 16.2064 17.5539C16.4512 17.5539 16.6599 17.4677 16.8323 17.2952C17.0048 17.1228 17.091 16.9141 17.091 16.6693C17.091 16.4244 17.0048 16.2158 16.8323 16.0433C16.6599 15.8709 16.4512 15.7847 16.2064 15.7847C15.9615 15.7847 15.7529 15.8709 15.5804 16.0433C15.408 16.2158 15.3218 16.4244 15.3218 16.6693C15.3218 16.9141 15.408 17.1228 15.5804 17.2952Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCalendarMonth;
