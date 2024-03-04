import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDelete = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-delete" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_21946"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21946)">
          <path
            d="M7.3077 21.0003C6.80898 21.0003 6.38302 20.8237 6.02982 20.4704C5.67661 20.1172 5.5 19.6913 5.5 19.1926V6.5003H4.5V5.00032H8.99997V4.11572H15V5.00032H19.5V6.5003H18.5V19.1926C18.5 19.6977 18.325 20.1253 17.975 20.4753C17.625 20.8253 17.1974 21.0003 16.6922 21.0003H7.3077ZM17 6.5003H6.99997V19.1926C6.99997 19.2823 7.02883 19.356 7.08652 19.4137C7.14422 19.4714 7.21795 19.5003 7.3077 19.5003H16.6922C16.7692 19.5003 16.8397 19.4682 16.9038 19.4041C16.9679 19.34 17 19.2695 17 19.1926V6.5003ZM9.40385 17.5003H10.9038V8.5003H9.40385V17.5003ZM13.0961 17.5003H14.5961V8.5003H13.0961V17.5003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDelete;
