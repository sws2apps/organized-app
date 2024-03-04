import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconError = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-error" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2583_34316"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2583_34316)">
          <path
            d="M12 17.2312C12.2288 17.2312 12.4207 17.1538 12.5755 16.999C12.7303 16.8442 12.8077 16.6524 12.8077 16.4235C12.8077 16.1947 12.7303 16.0029 12.5755 15.8481C12.4207 15.6933 12.2288 15.6159 12 15.6159C11.7711 15.6159 11.5793 15.6933 11.4245 15.8481C11.2697 16.0029 11.1923 16.1947 11.1923 16.4235C11.1923 16.6524 11.2697 16.8442 11.4245 16.999C11.5793 17.1538 11.7711 17.2312 12 17.2312ZM11.25 13.5774H12.75V7.57739H11.25V13.5774ZM12.0016 22.0004C10.6877 22.0004 9.45268 21.7511 8.29655 21.2524C7.1404 20.7538 6.13472 20.077 5.2795 19.2222C4.42427 18.3673 3.74721 17.3621 3.24833 16.2065C2.74944 15.0508 2.5 13.8161 2.5 12.5021C2.5 11.1882 2.74933 9.95317 3.248 8.79704C3.74667 7.64089 4.42342 6.63521 5.27825 5.77999C6.1331 4.92476 7.13834 4.2477 8.29398 3.74881C9.44959 3.24993 10.6844 3.00049 11.9983 3.00049C13.3122 3.00049 14.5473 3.24982 15.7034 3.74849C16.8596 4.24716 17.8652 4.92391 18.7205 5.77874C19.5757 6.63359 20.2527 7.63883 20.7516 8.79446C21.2505 9.95008 21.5 11.1849 21.5 12.4988C21.5 13.8127 21.2506 15.0478 20.752 16.2039C20.2533 17.36 19.5765 18.3657 18.7217 19.2209C17.8669 20.0762 16.8616 20.7532 15.706 21.2521C14.5504 21.751 13.3156 22.0004 12.0016 22.0004ZM12 20.5005C14.2333 20.5005 16.125 19.7255 17.675 18.1755C19.225 16.6255 20 14.7338 20 12.5005C20 10.2671 19.225 8.37546 17.675 6.82546C16.125 5.27546 14.2333 4.50046 12 4.50046C9.76664 4.50046 7.87498 5.27546 6.32498 6.82546C4.77498 8.37546 3.99998 10.2671 3.99998 12.5005C3.99998 14.7338 4.77498 16.6255 6.32498 18.1755C7.87498 19.7255 9.76664 20.5005 12 20.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconError;
