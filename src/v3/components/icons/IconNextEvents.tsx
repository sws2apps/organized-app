import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconNextEvents = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-next-events" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4516_168171"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4516_168171)">
          <path
            d="M15.8077 21.0004C15.3987 21.0004 15.0465 20.8527 14.751 20.5572C14.4555 20.2617 14.3077 19.9094 14.3077 19.5005V15.3081C14.3077 14.8992 14.4555 14.5469 14.751 14.2514C15.0465 13.9559 15.3987 13.8082 15.8077 13.8082H20C20.4089 13.8082 20.7612 13.9559 21.0567 14.2514C21.3522 14.5469 21.5 14.8992 21.5 15.3081V19.5005C21.5 19.9094 21.3522 20.2617 21.0567 20.5572C20.7612 20.8527 20.4089 21.0004 20 21.0004H15.8077ZM15.8077 19.5005H20V15.3081H15.8077V19.5005ZM2.5 18.1543V16.6543H11.1154V18.1543H2.5ZM15.8077 11.1927C15.3987 11.1927 15.0465 11.045 14.751 10.7495C14.4555 10.454 14.3077 10.1018 14.3077 9.69279V5.50046C14.3077 5.0915 14.4555 4.73926 14.751 4.44376C15.0465 4.14825 15.3987 4.00049 15.8077 4.00049H20C20.4089 4.00049 20.7612 4.14825 21.0567 4.44376C21.3522 4.73926 21.5 5.0915 21.5 5.50046V9.69279C21.5 10.1018 21.3522 10.454 21.0567 10.7495C20.7612 11.045 20.4089 11.1927 20 11.1927H15.8077ZM15.8077 9.69279H20V5.50046H15.8077V9.69279ZM2.5 8.34661V6.84664H11.1154V8.34661H2.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNextEvents;
