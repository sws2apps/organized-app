import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconNewStar = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-new-star"
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
          id="mask0_4965_2989909"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4965_2989909)">
          <path
            d="M7.875 6.74664L10.5788 3.19856C10.7583 2.95838 10.9714 2.78199 11.2182 2.66939C11.465 2.55679 11.7256 2.50049 12 2.50049C12.2743 2.50049 12.5349 2.55679 12.7817 2.66939C13.0285 2.78199 13.2416 2.95838 13.4211 3.19856L16.125 6.74664L20.2596 8.14279C20.6544 8.26972 20.9625 8.49363 21.1836 8.81451C21.4047 9.13541 21.5153 9.4899 21.5153 9.87796C21.5153 10.0571 21.4892 10.2356 21.4368 10.4137C21.3845 10.5917 21.2984 10.7623 21.1788 10.9255L18.4865 14.662L18.5865 18.6274C18.6031 19.1539 18.4296 19.5977 18.0658 19.9588C17.7021 20.3199 17.2782 20.5004 16.7942 20.5004C16.7801 20.5004 16.6128 20.4786 16.2923 20.435L12 19.2043L7.70768 20.435C7.62434 20.4684 7.53833 20.4876 7.44965 20.4927C7.36097 20.4979 7.27967 20.5004 7.20575 20.5004C6.7173 20.5004 6.29231 20.3199 5.93077 19.9588C5.56924 19.5977 5.39681 19.1539 5.41347 18.6274L5.51347 14.637L2.83655 10.9255C2.71688 10.7616 2.63087 10.5904 2.57852 10.4116C2.52617 10.2329 2.5 10.0542 2.5 9.87546C2.5 9.49835 2.60985 9.14763 2.82955 8.82331C3.04925 8.49898 3.35607 8.26894 3.75 8.13319L7.875 6.74664ZM8.8019 8.03892L4.23075 9.56199C4.1346 9.59404 4.06889 9.65975 4.03362 9.75911C3.99837 9.85848 4.0128 9.94984 4.0769 10.0332L7.02305 14.1908L6.91342 18.6581C6.90702 18.7671 6.94549 18.8537 7.02882 18.9178C7.11216 18.9819 7.20512 18.9979 7.3077 18.9658L12 17.6485L16.6923 18.9908C16.7948 19.0229 16.8878 19.0069 16.9711 18.9428C17.0545 18.8787 17.0929 18.7921 17.0865 18.6831L16.9769 14.1908L19.923 10.0832C19.9872 9.99984 20.0016 9.90848 19.9663 9.80911C19.9311 9.70975 19.8654 9.64404 19.7692 9.61199L15.198 8.03892L12.2404 4.13509C12.1827 4.05176 12.1025 4.01009 12 4.01009C11.8974 4.01009 11.8173 4.05176 11.7596 4.13509L8.8019 8.03892Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNewStar;
