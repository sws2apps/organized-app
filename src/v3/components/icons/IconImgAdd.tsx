import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconImgAdd = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-img-add" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2583_35276"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2583_35276)">
          <path
            d="M5.11529 21.0003C4.61818 21.0003 4.19262 20.8233 3.83862 20.4693C3.48462 20.1153 3.30762 19.6897 3.30762 19.1926V5.80805C3.30762 5.31093 3.48462 4.88537 3.83862 4.53137C4.19262 4.17736 4.61818 4.00035 5.11529 4.00035H13.8076V5.50032H5.11529C5.02554 5.50032 4.95182 5.52917 4.89412 5.58687C4.83642 5.64457 4.80757 5.7183 4.80757 5.80805V19.1926C4.80757 19.2823 4.83642 19.3561 4.89412 19.4138C4.95182 19.4715 5.02554 19.5003 5.11529 19.5003H18.4999C18.5896 19.5003 18.6633 19.4715 18.721 19.4138C18.7787 19.3561 18.8076 19.2823 18.8076 19.1926V10.5003H20.3075V19.1926C20.3075 19.6897 20.1305 20.1153 19.7765 20.4693C19.4225 20.8233 18.997 21.0003 18.4999 21.0003H5.11529ZM17.1922 9.11567V7.11567H15.1922V5.61572H17.1922V3.61572H18.6922V5.61572H20.6922V7.11567H18.6922V9.11567H17.1922ZM6.55762 17.2503H17.1344L13.846 12.8657L11.0383 16.5195L9.03837 13.9619L6.55762 17.2503Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImgAdd;
