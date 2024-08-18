import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconNotifications = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-notifications ${className}`}
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
          id="mask0_2473_22026"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_22026)">
          <path
            d="M4.5 18.8851V17.3851H6.3077V9.92354C6.3077 8.57867 6.72276 7.38957 7.55287 6.35624C8.38301 5.32291 9.44872 4.66201 10.75 4.37356V3.75049C10.75 3.40327 10.8714 3.10814 11.1143 2.86509C11.3571 2.62202 11.6519 2.50049 11.9988 2.50049C12.3457 2.50049 12.641 2.62202 12.8846 2.86509C13.1282 3.10814 13.25 3.40327 13.25 3.75049V4.37356C14.5512 4.66201 15.6169 5.32291 16.4471 6.35624C17.2772 7.38957 17.6922 8.57867 17.6922 9.92354V17.3851H19.5V18.8851H4.5ZM11.9983 21.6927C11.5007 21.6927 11.0753 21.5157 10.7221 21.1617C10.3689 20.8077 10.1923 20.3822 10.1923 19.8851H13.8077C13.8077 20.3838 13.6305 20.8097 13.2761 21.1629C12.9218 21.5161 12.4959 21.6927 11.9983 21.6927ZM7.80765 17.3851H16.1923V9.92354C16.1923 8.76584 15.783 7.7777 14.9644 6.95911C14.1458 6.14051 13.1577 5.73121 12 5.73121C10.8423 5.73121 9.85413 6.14051 9.03555 6.95911C8.21695 7.7777 7.80765 8.76584 7.80765 9.92354V17.3851Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNotifications;
