import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconImgRotate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-img-rotate ${className}`}
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
          id="mask0_2583_35274"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2583_35274)">
          <path
            d="M6.75003 17.7504H17.3269L14.0384 13.3658L11.2308 17.0196L9.23075 14.462L6.75003 17.7504ZM5.3077 21.5004C4.80898 21.5004 4.38302 21.3237 4.02982 20.9705C3.67661 20.6173 3.5 20.1914 3.5 19.6927V12.3081H4.99997V19.6927C4.99997 19.7824 5.02883 19.8561 5.08653 19.9138C5.14423 19.9715 5.21795 20.0004 5.3077 20.0004H18.6923C18.782 20.0004 18.8557 19.9715 18.9134 19.9138C18.9711 19.8561 19 19.7824 19 19.6927V12.3081H20.5V19.6927C20.5 20.1914 20.3233 20.6173 19.9701 20.9705C19.6169 21.3237 19.191 21.5004 18.6923 21.5004H5.3077Z"
            fill={color}
          />
          <path
            d="M20.0869 4.00054V9.38511H14.7023V7.88514H17.0831C16.4883 7.00821 15.7107 6.30819 14.7504 5.78509C13.7902 5.26201 12.7357 5.00046 11.5869 5.00046C10.0998 5.00046 8.7786 5.4056 7.62346 6.21586C6.46833 7.02611 5.63307 8.08253 5.11769 9.38511H3.50044C4.04659 7.66331 5.05684 6.2521 6.53119 5.15146C8.00554 4.05081 9.69079 3.50049 11.5869 3.50049C13.0613 3.50049 14.4091 3.84536 15.6302 4.53511C16.8514 5.22486 17.8369 6.14411 18.5869 7.29284V4.00054H20.0869Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImgRotate;
