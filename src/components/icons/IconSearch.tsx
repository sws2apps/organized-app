import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSearch = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-search ${className}`}
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
          id="mask0_2675_32305"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2675_32305)">
          <path
            d="M19.5422 20.5775L13.2615 14.2967C12.7615 14.7095 12.1865 15.0326 11.5365 15.266C10.8865 15.4993 10.214 15.616 9.51916 15.616C7.80999 15.616 6.36348 15.0242 5.17961 13.8406C3.99574 12.657 3.40381 11.2109 3.40381 9.50218C3.40381 7.79345 3.99559 6.34677 5.17916 5.16215C6.36273 3.97755 7.80888 3.38525 9.51761 3.38525C11.2263 3.38525 12.673 3.97719 13.8576 5.16106C15.0422 6.34492 15.6345 7.79144 15.6345 9.5006C15.6345 10.2147 15.5147 10.8968 15.2749 11.5468C15.0352 12.1968 14.7153 12.7621 14.3153 13.2429L20.5961 19.5237L19.5422 20.5775ZM9.51916 14.116C10.8076 14.116 11.899 13.6689 12.7932 12.7747C13.6874 11.8804 14.1346 10.7891 14.1346 9.5006C14.1346 8.21214 13.6874 7.12079 12.7932 6.22656C11.899 5.33232 10.8076 4.8852 9.51916 4.8852C8.23069 4.8852 7.13934 5.33232 6.24511 6.22656C5.35089 7.12079 4.90378 8.21214 4.90378 9.5006C4.90378 10.7891 5.35089 11.8804 6.24511 12.7747C7.13934 13.6689 8.23069 14.116 9.51916 14.116Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSearch;
