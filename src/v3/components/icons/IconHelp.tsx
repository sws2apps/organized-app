import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconHelp = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-help" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2520_27093"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2520_27093)">
          <path
            d="M11.989 18.1158C12.2745 18.1158 12.5157 18.0172 12.7125 17.8201C12.9093 17.6229 13.0077 17.3816 13.0077 17.0961C13.0077 16.8105 12.9091 16.5694 12.7119 16.3726C12.5148 16.1758 12.2734 16.0774 11.9879 16.0774C11.7024 16.0774 11.4612 16.176 11.2644 16.3731C11.0676 16.5703 10.9692 16.8116 10.9692 17.0971C10.9692 17.3827 11.0678 17.6238 11.265 17.8206C11.4621 18.0174 11.7034 18.1158 11.989 18.1158ZM11.2808 14.5351H12.6884C12.7012 14.0428 12.7734 13.6495 12.9048 13.3553C13.0362 13.061 13.3551 12.671 13.8615 12.1851C14.3012 11.7453 14.6381 11.3392 14.8721 10.9668C15.106 10.5944 15.223 10.1546 15.223 9.64734C15.223 8.78662 14.9137 8.11427 14.2952 7.63029C13.6766 7.14632 12.9449 6.90434 12.1 6.90434C11.2654 6.90434 10.5747 7.1271 10.0279 7.57261C9.48109 8.01811 9.09103 8.54278 8.8577 9.14661L10.1423 9.66199C10.2641 9.32994 10.4724 9.00655 10.7673 8.69181C11.0622 8.37706 11.5 8.21969 12.0808 8.21969C12.6718 8.21969 13.1086 8.38156 13.3913 8.70529C13.674 9.02901 13.8154 9.3851 13.8154 9.77356C13.8154 10.1133 13.7186 10.4242 13.525 10.7062C13.3314 10.9883 13.0846 11.2607 12.7846 11.5236C12.1282 12.1159 11.7135 12.5883 11.5404 12.9409C11.3673 13.2934 11.2808 13.8248 11.2808 14.5351ZM12.0016 22.0004C10.6877 22.0004 9.45268 21.7511 8.29655 21.2524C7.1404 20.7538 6.13472 20.077 5.2795 19.2222C4.42427 18.3673 3.74721 17.3621 3.24833 16.2065C2.74944 15.0508 2.5 13.8161 2.5 12.5021C2.5 11.1882 2.74933 9.95317 3.248 8.79704C3.74667 7.64089 4.42342 6.63521 5.27825 5.77999C6.1331 4.92476 7.13834 4.2477 8.29398 3.74881C9.44959 3.24993 10.6844 3.00049 11.9983 3.00049C13.3122 3.00049 14.5473 3.24982 15.7034 3.74849C16.8596 4.24716 17.8652 4.92391 18.7205 5.77874C19.5757 6.63359 20.2527 7.63883 20.7516 8.79446C21.2505 9.95008 21.5 11.1849 21.5 12.4988C21.5 13.8127 21.2506 15.0478 20.752 16.2039C20.2533 17.36 19.5765 18.3657 18.7217 19.2209C17.8669 20.0762 16.8616 20.7532 15.706 21.2521C14.5504 21.751 13.3156 22.0004 12.0016 22.0004ZM12 20.5005C14.2333 20.5005 16.125 19.7255 17.675 18.1755C19.225 16.6255 20 14.7338 20 12.5005C20 10.2671 19.225 8.37546 17.675 6.82546C16.125 5.27546 14.2333 4.50046 12 4.50046C9.76664 4.50046 7.87498 5.27546 6.32498 6.82546C4.77498 8.37546 3.99998 10.2671 3.99998 12.5005C3.99998 14.7338 4.77498 16.6255 6.32498 18.1755C7.87498 19.7255 9.76664 20.5005 12 20.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconHelp;
