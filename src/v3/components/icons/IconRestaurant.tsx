import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRestaurant = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-restaurant" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980559"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980559)">
          <path
            d="M7.24986 22.2505V13.1581C6.43833 12.9825 5.75468 12.5719 5.19891 11.9264C4.64313 11.2809 4.36523 10.5107 4.36523 9.61586V2.75049H5.86521V9.61586H7.24986V2.75049H8.74981V9.61586H10.1345V2.75049H11.6344V9.61586C11.6344 10.5107 11.3565 11.2809 10.8008 11.9264C10.245 12.5719 9.56134 12.9825 8.74981 13.1581V22.2504L7.24986 22.2505ZM16.8652 22.2505V14.2504H14.1345V7.50046C14.1345 6.25176 14.5354 5.16876 15.3373 4.25144C16.1392 3.33414 17.1485 2.84023 18.3652 2.76971V22.2505H16.8652Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRestaurant;
