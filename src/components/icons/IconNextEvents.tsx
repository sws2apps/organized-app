import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconNextEvents = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-next-events ${className}`}
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
          id="mask0_4516_168171"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4516_168171)">
          <path
            d="M15.8077 20.5004C15.3987 20.5004 15.0465 20.3527 14.751 20.0572C14.4555 19.7617 14.3077 19.4094 14.3077 19.0005V14.8081C14.3077 14.3992 14.4555 14.0469 14.751 13.7514C15.0465 13.4559 15.3987 13.3082 15.8077 13.3082H20C20.4089 13.3082 20.7612 13.4559 21.0567 13.7514C21.3522 14.0469 21.5 14.3992 21.5 14.8081V19.0005C21.5 19.4094 21.3522 19.7617 21.0567 20.0572C20.7612 20.3527 20.4089 20.5004 20 20.5004H15.8077ZM15.8077 19.0005H20V14.8081H15.8077V19.0005ZM2.5 17.6543V16.1543H11.1154V17.6543H2.5ZM15.8077 10.6927C15.3987 10.6927 15.0465 10.545 14.751 10.2495C14.4555 9.95399 14.3077 9.60176 14.3077 9.19279V5.00046C14.3077 4.5915 14.4555 4.23926 14.751 3.94376C15.0465 3.64825 15.3987 3.50049 15.8077 3.50049H20C20.4089 3.50049 20.7612 3.64825 21.0567 3.94376C21.3522 4.23926 21.5 4.5915 21.5 5.00046V9.19279C21.5 9.60176 21.3522 9.95399 21.0567 10.2495C20.7612 10.545 20.4089 10.6927 20 10.6927H15.8077ZM15.8077 9.19279H20V5.00046H15.8077V9.19279ZM2.5 7.84661V6.34664H11.1154V7.84661H2.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNextEvents;
