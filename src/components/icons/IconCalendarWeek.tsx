import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCalendarWeek = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-calendar-week"
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
          id="mask0_2513_2501"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2501)">
          <path
            d="M7.99998 13.9429C7.75511 13.9429 7.54646 13.8567 7.37403 13.6843C7.20159 13.5118 7.11538 13.3032 7.11538 13.0583C7.11538 12.8134 7.20159 12.6048 7.37403 12.4324C7.54646 12.2599 7.75511 12.1737 7.99998 12.1737C8.24484 12.1737 8.45349 12.2599 8.62593 12.4324C8.79836 12.6048 8.88458 12.8134 8.88458 13.0583C8.88458 13.3032 8.79836 13.5118 8.62593 13.6843C8.45349 13.8567 8.24484 13.9429 7.99998 13.9429ZM12 13.9429C11.7551 13.9429 11.5465 13.8567 11.374 13.6843C11.2016 13.5118 11.1154 13.3032 11.1154 13.0583C11.1154 12.8134 11.2016 12.6048 11.374 12.4324C11.5465 12.2599 11.7551 12.1737 12 12.1737C12.2448 12.1737 12.4535 12.2599 12.6259 12.4324C12.7984 12.6048 12.8846 12.8134 12.8846 13.0583C12.8846 13.3032 12.7984 13.5118 12.6259 13.6843C12.4535 13.8567 12.2448 13.9429 12 13.9429ZM16 13.9429C15.7551 13.9429 15.5465 13.8567 15.374 13.6843C15.2016 13.5118 15.1154 13.3032 15.1154 13.0583C15.1154 12.8134 15.2016 12.6048 15.374 12.4324C15.5465 12.2599 15.7551 12.1737 16 12.1737C16.2448 12.1737 16.4535 12.2599 16.6259 12.4324C16.7984 12.6048 16.8846 12.8134 16.8846 13.0583C16.8846 13.3032 16.7984 13.5118 16.6259 13.6843C16.4535 13.8567 16.2448 13.9429 16 13.9429ZM5.3077 21.5006C4.80257 21.5006 4.375 21.3256 4.025 20.9756C3.675 20.6256 3.5 20.198 3.5 19.6929V6.30833C3.5 5.8032 3.675 5.37563 4.025 5.02563C4.375 4.67563 4.80257 4.50063 5.3077 4.50063H6.69233V2.38525H8.23075V4.50063H15.8077V2.38525H17.3076V4.50063H18.6923C19.1974 4.50063 19.625 4.67563 19.975 5.02563C20.325 5.37563 20.5 5.8032 20.5 6.30833V19.6929C20.5 20.198 20.325 20.6256 19.975 20.9756C19.625 21.3256 19.1974 21.5006 18.6923 21.5006H5.3077ZM5.3077 20.0006H18.6923C18.7692 20.0006 18.8397 19.9686 18.9038 19.9045C18.9679 19.8403 19 19.7698 19 19.6929V10.3083H4.99997V19.6929C4.99997 19.7698 5.03202 19.8403 5.09612 19.9045C5.16024 19.9686 5.23077 20.0006 5.3077 20.0006ZM4.99997 8.80835H19V6.30833C19 6.2314 18.9679 6.16087 18.9038 6.09675C18.8397 6.03265 18.7692 6.0006 18.6923 6.0006H5.3077C5.23077 6.0006 5.16024 6.03265 5.09612 6.09675C5.03202 6.16087 4.99997 6.2314 4.99997 6.30833V8.80835Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCalendarWeek;
