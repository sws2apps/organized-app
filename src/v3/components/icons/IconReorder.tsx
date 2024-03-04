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
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3478_151178)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.8795 13.2505L19.5305 13.2505L17.4459 15.3351L18.5151 16.4043L22.4189 12.5005L18.5151 8.59668L17.4459 9.66588L19.5305 11.7505L15.8795 11.7505L15.8795 13.2505ZM8.33138 13.2505L4.58316 13.2505L6.66781 15.3197L5.58321 16.4043L1.67939 12.5005L5.58321 8.59668L6.65241 9.66588L4.56779 11.7505L8.33138 11.7505L8.33138 13.2505Z"
            fill={color}
          />
          <circle cx="12.0488" cy="12.5005" r="2" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReorder;
