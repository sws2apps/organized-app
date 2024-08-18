import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSourceMaterial = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-source-material ${className}`}
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
          id="mask0_2513_2634"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2634)">
          <path
            d="M5.99997 21.5004C5.30127 21.5004 4.70993 21.2585 4.22595 20.7745C3.74198 20.2905 3.5 19.6992 3.5 19.0005V16.1159H6.5V2.50049H20.5V19.0005C20.5 19.6992 20.258 20.2905 19.774 20.7745C19.29 21.2585 18.6987 21.5004 18 21.5004H5.99997ZM18 20.0005C18.2833 20.0005 18.5208 19.9046 18.7125 19.713C18.9041 19.5213 19 19.2838 19 19.0005V4.00046H7.99998V16.1159H17V19.0005C17 19.2838 17.0958 19.5213 17.2875 19.713C17.4791 19.9046 17.7166 20.0005 18 20.0005ZM9.1923 8.69274V7.19279H17.8077V8.69274H9.1923ZM9.1923 11.5774V10.0774H17.8077V11.5774H9.1923ZM5.99997 20.0005H15.5V17.6158H4.99997V19.0005C4.99997 19.2838 5.09581 19.5213 5.28747 19.713C5.47914 19.9046 5.71664 20.0005 5.99997 20.0005ZM5.99997 20.0005H4.99997H15.5H5.99997Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSourceMaterial;
