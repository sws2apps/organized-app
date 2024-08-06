import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLock = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-lock"
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
          id="mask0_2674_31399"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_31399)">
          <path
            d="M6.3077 21.5004C5.80898 21.5004 5.38302 21.3238 5.02982 20.9706C4.67661 20.6174 4.5 20.1914 4.5 19.6927V10.3081C4.5 9.80942 4.67661 9.38346 5.02982 9.03026C5.38302 8.67705 5.80898 8.50044 6.3077 8.50044H7.5V6.50044C7.5 5.25174 7.93782 4.18957 8.81345 3.31394C9.6891 2.43831 10.7513 2.00049 12 2.00049C13.2487 2.00049 14.3108 2.43831 15.1865 3.31394C16.0621 4.18957 16.5 5.25174 16.5 6.50044V8.50044H17.6922C18.191 8.50044 18.6169 8.67705 18.9701 9.03026C19.3233 9.38346 19.5 9.80942 19.5 10.3081V19.6927C19.5 20.1914 19.3233 20.6174 18.9701 20.9706C18.6169 21.3238 18.191 21.5004 17.6922 21.5004H6.3077ZM6.3077 20.0004H17.6922C17.782 20.0004 17.8557 19.9716 17.9134 19.9139C17.9711 19.8562 18 19.7824 18 19.6927V10.3081C18 10.2184 17.9711 10.1447 17.9134 10.087C17.8557 10.0293 17.782 10.0004 17.6922 10.0004H6.3077C6.21795 10.0004 6.14423 10.0293 6.08652 10.087C6.02882 10.1447 5.99997 10.2184 5.99997 10.3081V19.6927C5.99997 19.7824 6.02882 19.8562 6.08652 19.9139C6.14423 19.9716 6.21795 20.0004 6.3077 20.0004ZM12 16.7504C12.4859 16.7504 12.899 16.5802 13.2394 16.2398C13.5798 15.8994 13.75 15.4863 13.75 15.0004C13.75 14.5145 13.5798 14.1014 13.2394 13.761C12.899 13.4206 12.4859 13.2504 12 13.2504C11.5141 13.2504 11.1009 13.4206 10.7606 13.761C10.4202 14.1014 10.25 14.5145 10.25 15.0004C10.25 15.4863 10.4202 15.8994 10.7606 16.2398C11.1009 16.5802 11.5141 16.7504 12 16.7504ZM8.99997 8.50044H15V6.50044C15 5.6671 14.7083 4.95877 14.125 4.37544C13.5416 3.7921 12.8333 3.50044 12 3.50044C11.1666 3.50044 10.4583 3.7921 9.87497 4.37544C9.29164 4.95877 8.99997 5.6671 8.99997 6.50044V8.50044Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLock;
