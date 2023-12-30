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
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21946)">
          <path
            d="M7.3077 20.5C6.80898 20.5 6.38302 20.3234 6.02982 19.9702C5.67661 19.617 5.5 19.191 5.5 18.6923V6.00005H4.5V4.50008H8.99997V3.61548H15V4.50008H19.5V6.00005H18.5V18.6923C18.5 19.1975 18.325 19.625 17.975 19.975C17.625 20.325 17.1974 20.5 16.6922 20.5H7.3077ZM17 6.00005H6.99997V18.6923C6.99997 18.7821 7.02883 18.8558 7.08652 18.9135C7.14422 18.9712 7.21795 19.0001 7.3077 19.0001H16.6922C16.7692 19.0001 16.8397 18.968 16.9038 18.9039C16.9679 18.8398 17 18.7693 17 18.6923V6.00005ZM9.40385 17.0001H10.9038V8.00005H9.40385V17.0001ZM13.0961 17.0001H14.5961V8.00005H13.0961V17.0001Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDelete;
