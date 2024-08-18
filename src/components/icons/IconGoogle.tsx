import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconGoogle = ({
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-google ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2633_30281)">
          <path
            d="M5.31891 14.5035L4.4835 17.6222L1.43011 17.6868C0.517594 15.9943 0 14.0578 0 12C0 10.0101 0.483938 8.13362 1.34175 6.48132H1.34241L4.06078 6.9797L5.25159 9.68176C5.00236 10.4084 4.86652 11.1884 4.86652 12C4.86661 12.8809 5.02617 13.7249 5.31891 14.5035Z"
            fill="#FBBB00"
          />
          <path
            d="M23.7904 9.7583C23.9282 10.4842 24.0001 11.2339 24.0001 12.0001C24.0001 12.8592 23.9098 13.6972 23.7377 14.5056C23.1535 17.2563 21.6272 19.6583 19.5127 21.3581L16.0881 21.1827L15.6035 18.1576C17.0065 17.3348 18.103 16.0471 18.6806 14.5056H12.2639V9.7583H23.7904Z"
            fill="#518EF8"
          />
          <path
            d="M19.5119 21.3574L19.5126 21.358C17.4561 23.011 14.8438 24 12.0001 24C7.43018 24 3.457 21.4457 1.43018 17.6868L5.31897 14.5035C6.33236 17.2081 8.94138 19.1334 12.0001 19.1334C13.3148 19.1334 14.5465 18.778 15.6033 18.1576L19.5119 21.3574Z"
            fill="#28B446"
          />
          <path
            d="M19.6596 2.76262L15.7721 5.94525C14.6783 5.26153 13.3853 4.86656 12 4.86656C8.87213 4.86656 6.21431 6.88017 5.25169 9.68175L1.34245 6.48131H1.3418C3.33895 2.63077 7.36224 0 12 0C14.9117 0 17.5814 1.03716 19.6596 2.76262Z"
            fill="#F14336"
          />
        </g>
        <defs>
          <clipPath id="clip0_2633_30281">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
};

export default IconGoogle;
