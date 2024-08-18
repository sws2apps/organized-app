import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconImgAdd = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-img-add ${className}`}
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
          id="mask0_2583_35276"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2583_35276)">
          <path
            d="M5.11529 20.5003C4.61818 20.5003 4.19262 20.3233 3.83862 19.9693C3.48462 19.6153 3.30762 19.1897 3.30762 18.6926V5.30805C3.30762 4.81093 3.48462 4.38537 3.83862 4.03137C4.19262 3.67736 4.61818 3.50035 5.11529 3.50035H13.8076V5.00032H5.11529C5.02554 5.00032 4.95182 5.02917 4.89412 5.08687C4.83642 5.14457 4.80757 5.2183 4.80757 5.30805V18.6926C4.80757 18.7823 4.83642 18.8561 4.89412 18.9138C4.95182 18.9715 5.02554 19.0003 5.11529 19.0003H18.4999C18.5896 19.0003 18.6633 18.9715 18.721 18.9138C18.7787 18.8561 18.8076 18.7823 18.8076 18.6926V10.0003H20.3075V18.6926C20.3075 19.1897 20.1305 19.6153 19.7765 19.9693C19.4225 20.3233 18.997 20.5003 18.4999 20.5003H5.11529ZM17.1922 8.61567V6.61567H15.1922V5.11572H17.1922V3.11572H18.6922V5.11572H20.6922V6.61567H18.6922V8.61567H17.1922ZM6.55762 16.7503H17.1344L13.846 12.3657L11.0383 16.0195L9.03837 13.4619L6.55762 16.7503Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImgAdd;
