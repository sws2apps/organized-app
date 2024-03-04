import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPark = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-park" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980563"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980563)">
          <path
            d="M13.4692 22.0002H10.5308V18.0002H3.94238L7.94238 12.0002H5.96161L12 3.36572L18.0384 12.0002H16.0576L20.0576 18.0002H13.4692V22.0002ZM6.75001 16.5003H10.75H8.85001H15.15H13.25H17.25H6.75001ZM6.75001 16.5003H17.25L13.25 10.5003H15.15L12 6.00027L8.85001 10.5003H10.75L6.75001 16.5003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPark;
