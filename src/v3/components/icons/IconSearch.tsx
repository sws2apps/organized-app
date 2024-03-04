import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSearch = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-search" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2675_32305"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2675_32305)">
          <path
            d="M19.5422 21.0775L13.2615 14.7967C12.7615 15.2095 12.1865 15.5326 11.5365 15.766C10.8865 15.9993 10.214 16.116 9.51916 16.116C7.80999 16.116 6.36348 15.5242 5.17961 14.3406C3.99574 13.157 3.40381 11.7109 3.40381 10.0022C3.40381 8.29345 3.99559 6.84677 5.17916 5.66215C6.36273 4.47755 7.80888 3.88525 9.51761 3.88525C11.2263 3.88525 12.673 4.47719 13.8576 5.66106C15.0422 6.84492 15.6345 8.29144 15.6345 10.0006C15.6345 10.7147 15.5147 11.3968 15.2749 12.0468C15.0352 12.6968 14.7153 13.2621 14.3153 13.7429L20.5961 20.0237L19.5422 21.0775ZM9.51916 14.616C10.8076 14.616 11.899 14.1689 12.7932 13.2747C13.6874 12.3804 14.1346 11.2891 14.1346 10.0006C14.1346 8.71214 13.6874 7.62079 12.7932 6.72656C11.899 5.83232 10.8076 5.3852 9.51916 5.3852C8.23069 5.3852 7.13934 5.83232 6.24511 6.72656C5.35089 7.62079 4.90378 8.71214 4.90378 10.0006C4.90378 11.2891 5.35089 12.3804 6.24511 13.2747C7.13934 14.1689 8.23069 14.616 9.51916 14.616Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSearch;
