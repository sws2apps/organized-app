import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMicrophone = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-microphone ${className}`}
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
          id="mask0_4432_164532"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164532)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2982 22.9604L15.6115 11.1528H8.38818L9.70146 22.9604H14.2982ZM12.8657 21.5604H11.1743L10.293 12.656H13.747L12.8657 21.5604Z"
            fill={color}
          />
          <path
            d="M7.38574 5.71442C7.38574 3.42111 9.24484 1.56201 11.5381 1.56201H12.4616C14.7549 1.56201 16.614 3.42111 16.614 5.71442V8.81335C16.614 9.36564 16.1663 9.81335 15.614 9.81335H8.38574C7.83346 9.81335 7.38574 9.36564 7.38574 8.81335V5.71442Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMicrophone;
