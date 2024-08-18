import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDelete = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-delete ${className}`}
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
          id="mask0_2473_21946"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21946)">
          <path
            d="M7.3077 20.5003C6.80898 20.5003 6.38302 20.3237 6.02982 19.9704C5.67661 19.6172 5.5 19.1913 5.5 18.6926V6.0003H4.5V4.50032H8.99997V3.61572H15V4.50032H19.5V6.0003H18.5V18.6926C18.5 19.1977 18.325 19.6253 17.975 19.9753C17.625 20.3253 17.1974 20.5003 16.6922 20.5003H7.3077ZM17 6.0003H6.99997V18.6926C6.99997 18.7823 7.02883 18.856 7.08652 18.9137C7.14422 18.9714 7.21795 19.0003 7.3077 19.0003H16.6922C16.7692 19.0003 16.8397 18.9682 16.9038 18.9041C16.9679 18.84 17 18.7695 17 18.6926V6.0003ZM9.40385 17.0003H10.9038V8.0003H9.40385V17.0003ZM13.0961 17.0003H14.5961V8.0003H13.0961V17.0003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDelete;
