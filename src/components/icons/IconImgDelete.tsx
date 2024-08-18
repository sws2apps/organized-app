import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconImgDelete = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-img-delete ${className}`}
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
          id="mask0_2583_35275"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2583_35275)">
          <path
            d="M5.11529 20.5004C4.61818 20.5004 4.19262 20.3234 3.83862 19.9694C3.48462 19.6154 3.30762 19.1899 3.30762 18.6927V5.30819C3.30762 4.81107 3.48462 4.38551 3.83862 4.03151C4.19262 3.6775 4.61818 3.50049 5.11529 3.50049H10V5.00046H5.11529C5.02554 5.00046 4.95182 5.02931 4.89412 5.08701C4.83642 5.14471 4.80757 5.21844 4.80757 5.30819V18.6927C4.80757 18.7825 4.83642 18.8562 4.89412 18.9139C4.95182 18.9716 5.02554 19.0005 5.11529 19.0005H18.4999C18.5896 19.0005 18.6633 18.9716 18.721 18.9139C18.7787 18.8562 18.8076 18.7825 18.8076 18.6927V13.0005H20.3075V18.6927C20.3075 19.1899 20.1305 19.6154 19.7765 19.9694C19.4225 20.3234 18.997 20.5004 18.4999 20.5004H5.11529ZM6.55762 16.7504H17.1344L13.846 12.3659L11.0383 16.0197L9.03837 13.462L6.55762 16.7504Z"
            fill={color}
          />
          <mask
            id="mask1_2583_35275"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="11"
            y="2"
            width="10"
            height="11"
          >
            <rect x="11" y="2.00049" width="10" height="10" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask1_2583_35275)">
            <path
              d="M13.8022 11.1043C13.4342 11.1043 13.1234 10.9776 12.87 10.7241C12.6165 10.4707 12.4897 10.1599 12.4897 9.79183V4.61475H11.8335V3.30225H14.5106V2.646H17.4689V3.30225H20.1668V4.61475H19.5106V9.79183C19.5106 10.1599 19.3838 10.4707 19.1304 10.7241C18.8769 10.9776 18.5661 11.1043 18.1981 11.1043H13.8022ZM18.1981 4.61475H13.8022V9.79183H18.1981V4.61475ZM14.5627 9.07308H15.6356V5.32308H14.5627V9.07308ZM16.3647 9.07308H17.4377V5.32308H16.3647V9.07308Z"
              fill={color}
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImgDelete;
