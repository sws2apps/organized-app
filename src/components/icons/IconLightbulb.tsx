import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLightbulb = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-lightbulb ${className}`}
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
          id="mask0_13161_343543"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343543)">
          <path
            d="M12 21.5769C11.4949 21.5769 11.0593 21.4019 10.6932 21.0519C10.3272 20.7019 10.1282 20.2743 10.0961 19.7692H13.9038C13.8718 20.2743 13.6727 20.7019 13.3067 21.0519C12.9407 21.4019 12.5051 21.5769 12 21.5769ZM8.25 18.3846V16.8846H15.75V18.3846H8.25ZM8.40382 15.5C7.35641 14.8487 6.52725 13.9977 5.91635 12.9471C5.30545 11.8964 5 10.7474 5 9.49998C5 7.55128 5.67948 5.89743 7.03845 4.53845C8.39743 3.17948 10.0513 2.5 12 2.5C13.9487 2.5 15.6025 3.17948 16.9615 4.53845C18.3205 5.89743 19 7.55128 19 9.49998C19 10.7474 18.6945 11.8964 18.0836 12.9471C17.4727 13.9977 16.6435 14.8487 15.5961 15.5H8.40382ZM8.84997 14H15.15C15.9 13.4666 16.4791 12.8083 16.8875 12.025C17.2958 11.2416 17.5 10.4 17.5 9.49998C17.5 7.96664 16.9666 6.66664 15.9 5.59998C14.8333 4.53331 13.5333 3.99998 12 3.99998C10.4666 3.99998 9.16664 4.53331 8.09997 5.59998C7.03331 6.66664 6.49997 7.96664 6.49997 9.49998C6.49997 10.4 6.70414 11.2416 7.11247 12.025C7.52081 12.8083 8.09997 13.4666 8.84997 14Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLightbulb;
