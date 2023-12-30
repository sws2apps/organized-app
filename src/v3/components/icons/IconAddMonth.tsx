import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAddMonth = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-add-month" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3859_136800"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3859_136800)">
          <path
            d="M17.25 21.75V18.75H14.25V17.25H17.25V14.25H18.75V17.25H21.75V18.75H18.75V21.75L17.25 21.75ZM5.3077 19.5C4.80257 19.5 4.375 19.325 4.025 18.975C3.675 18.625 3.5 18.1974 3.5 17.6923V6.30772C3.5 5.80259 3.675 5.37502 4.025 5.02502C4.375 4.67502 4.80257 4.50002 5.3077 4.50002H6.69233V2.38464H8.23075V4.50002H13.8077V2.38464H15.3076V4.50002H16.6922C17.1974 4.50002 17.625 4.67502 17.975 5.02502C18.325 5.37502 18.5 5.80259 18.5 6.30772V12.2154C18.25 12.1846 18 12.1692 17.75 12.1692C17.5 12.1692 17.25 12.1846 17 12.2154V10.3077H4.99997V17.6923C4.99997 17.7692 5.03202 17.8397 5.09612 17.9038C5.16024 17.9679 5.23077 18 5.3077 18H12.1442C12.1442 18.25 12.1596 18.5 12.1904 18.75C12.2211 19 12.2776 19.25 12.3596 19.5H5.3077ZM4.99997 8.80774H17V6.30772C17 6.23079 16.9679 6.16026 16.9038 6.09614C16.8397 6.03204 16.7692 5.99999 16.6922 5.99999H5.3077C5.23077 5.99999 5.16024 6.03204 5.09612 6.09614C5.03202 6.16026 4.99997 6.23079 4.99997 6.30772V8.80774Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAddMonth;
