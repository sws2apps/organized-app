import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMicrosoft = ({
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-microsoft ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2633_30355)">
          <path
            d="M12.7935 11.25H24.0435V0.75C24.0435 0.336 23.7075 0 23.2935 0H12.7935V11.25Z"
            fill="#4CAF50"
          />
          <path
            d="M11.2935 11.25V0H0.793457C0.379457 0 0.043457 0.336 0.043457 0.75V11.25H11.2935Z"
            fill="#F44336"
          />
          <path
            d="M11.2935 12.75H0.043457V23.25C0.043457 23.664 0.379457 24 0.793457 24H11.2935V12.75Z"
            fill="#2196F3"
          />
          <path
            d="M12.7935 12.75V24H23.2935C23.7075 24 24.0435 23.664 24.0435 23.25V12.75H12.7935Z"
            fill="#FFC107"
          />
        </g>
        <defs>
          <clipPath id="clip0_2633_30355">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.043457)"
            />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
};

export default IconMicrosoft;
