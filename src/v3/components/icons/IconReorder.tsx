import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconReorder = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-reorder" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3478_151178"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3478_151178)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.8795 12.75L19.5305 12.75L17.4459 14.8346L18.5151 15.9038L22.4189 12L18.5151 8.09619L17.4459 9.16539L19.5305 11.25L15.8795 11.25L15.8795 12.75ZM8.33138 12.75L4.58316 12.75L6.66781 14.8192L5.58321 15.9038L1.67939 12L5.58321 8.09619L6.65241 9.16539L4.56779 11.25L8.33138 11.25L8.33138 12.75Z"
            fill={color}
          />
          <circle cx="12.0491" cy="12" r="2" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReorder;
