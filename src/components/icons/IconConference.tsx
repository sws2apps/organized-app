import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconConference = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-conference"
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
          id="mask0_3885_131898"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3885_131898)">
          <path
            d="M6.58636 15.6543H13.894V15.2966C13.894 14.6658 13.5546 14.1511 12.8757 13.7524C12.1969 13.3537 11.3184 13.1543 10.2402 13.1543C9.16198 13.1543 8.28347 13.3537 7.60463 13.7524C6.92578 14.1511 6.58636 14.6658 6.58636 15.2966V15.6543ZM10.2402 11.8466C10.7261 11.8466 11.1392 11.6764 11.4796 11.336C11.82 10.9957 11.9902 10.5825 11.9902 10.0966C11.9902 9.61073 11.82 9.1976 11.4796 8.85721C11.1392 8.51683 10.7261 8.34664 10.2402 8.34664C9.7543 8.34664 9.34117 8.51683 9.00079 8.85721C8.6604 9.1976 8.49021 9.61073 8.49021 10.0966C8.49021 10.5825 8.6604 10.9957 9.00079 11.336C9.34117 11.6764 9.7543 11.8466 10.2402 11.8466ZM4.54791 19.5004C4.04278 19.5004 3.61521 19.3254 3.26521 18.9754C2.91523 18.6254 2.74023 18.1979 2.74023 17.6927V6.30819C2.74023 5.80306 2.91523 5.37549 3.26521 5.02549C3.61521 4.67549 4.04278 4.50049 4.54791 4.50049H15.9325C16.4376 4.50049 16.8652 4.67549 17.2152 5.02549C17.5652 5.37549 17.7402 5.80306 17.7402 6.30819V10.8851L21.2593 7.36591V16.635L17.7402 13.1158V17.6927C17.7402 18.1979 17.5652 18.6254 17.2152 18.9754C16.8652 19.3254 16.4376 19.5004 15.9325 19.5004H4.54791ZM4.54791 18.0005H15.9325C16.0222 18.0005 16.096 17.9716 16.1536 17.9139C16.2113 17.8562 16.2402 17.7825 16.2402 17.6927V6.30819C16.2402 6.21844 16.2113 6.14471 16.1536 6.08701C16.096 6.02931 16.0222 6.00046 15.9325 6.00046H4.54791C4.45816 6.00046 4.38443 6.02931 4.32673 6.08701C4.26903 6.14471 4.24018 6.21844 4.24018 6.30819V17.6927C4.24018 17.7825 4.26903 17.8562 4.32673 17.9139C4.38443 17.9716 4.45816 18.0005 4.54791 18.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconConference;
