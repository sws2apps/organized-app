import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconReorder = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-reorder ${className}`}
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
          id="mask0_3478_151178"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3478_151178)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.8795 12.7505L19.5305 12.7505L17.4459 14.8351L18.5151 15.9043L22.4189 12.0005L18.5151 8.09668L17.4459 9.16588L19.5305 11.2505L15.8795 11.2505L15.8795 12.7505ZM8.33138 12.7505L4.58316 12.7505L6.66781 14.8197L5.58321 15.9043L1.67939 12.0005L5.58321 8.09668L6.65241 9.16588L4.56779 11.2505L8.33138 11.2505L8.33138 12.7505Z"
            fill={color}
          />
          <circle cx="12.0488" cy="12.0005" r="2" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReorder;
