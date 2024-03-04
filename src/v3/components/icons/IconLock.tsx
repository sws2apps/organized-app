import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLock = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-lock" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2674_31399"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_31399)">
          <path
            d="M6.3077 22.0004C5.80898 22.0004 5.38302 21.8238 5.02982 21.4706C4.67661 21.1174 4.5 20.6914 4.5 20.1927V10.8081C4.5 10.3094 4.67661 9.88346 5.02982 9.53026C5.38302 9.17705 5.80898 9.00044 6.3077 9.00044H7.5V7.00044C7.5 5.75174 7.93782 4.68957 8.81345 3.81394C9.6891 2.93831 10.7513 2.50049 12 2.50049C13.2487 2.50049 14.3108 2.93831 15.1865 3.81394C16.0621 4.68957 16.5 5.75174 16.5 7.00044V9.00044H17.6922C18.191 9.00044 18.6169 9.17705 18.9701 9.53026C19.3233 9.88346 19.5 10.3094 19.5 10.8081V20.1927C19.5 20.6914 19.3233 21.1174 18.9701 21.4706C18.6169 21.8238 18.191 22.0004 17.6922 22.0004H6.3077ZM6.3077 20.5004H17.6922C17.782 20.5004 17.8557 20.4716 17.9134 20.4139C17.9711 20.3562 18 20.2824 18 20.1927V10.8081C18 10.7184 17.9711 10.6447 17.9134 10.587C17.8557 10.5293 17.782 10.5004 17.6922 10.5004H6.3077C6.21795 10.5004 6.14423 10.5293 6.08652 10.587C6.02882 10.6447 5.99997 10.7184 5.99997 10.8081V20.1927C5.99997 20.2824 6.02882 20.3562 6.08652 20.4139C6.14423 20.4716 6.21795 20.5004 6.3077 20.5004ZM12 17.2504C12.4859 17.2504 12.899 17.0802 13.2394 16.7398C13.5798 16.3994 13.75 15.9863 13.75 15.5004C13.75 15.0145 13.5798 14.6014 13.2394 14.261C12.899 13.9206 12.4859 13.7504 12 13.7504C11.5141 13.7504 11.1009 13.9206 10.7606 14.261C10.4202 14.6014 10.25 15.0145 10.25 15.5004C10.25 15.9863 10.4202 16.3994 10.7606 16.7398C11.1009 17.0802 11.5141 17.2504 12 17.2504ZM8.99997 9.00044H15V7.00044C15 6.1671 14.7083 5.45877 14.125 4.87544C13.5416 4.2921 12.8333 4.00044 12 4.00044C11.1666 4.00044 10.4583 4.2921 9.87497 4.87544C9.29164 5.45877 8.99997 6.1671 8.99997 7.00044V9.00044Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLock;
