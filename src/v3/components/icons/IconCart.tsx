import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCart = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-cart" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.93961 0.919434H17.3821L14.5923 21.9325H13.7167L13.5189 23.3929C13.4547 23.7879 13.0709 24.0813 12.6182 24.0813H7.49166C6.94388 24.0813 6.5203 23.6577 6.58902 23.1787L6.71984 21.8887H6.09913L8.93961 0.919434ZM7.94538 20.4889H8.57171L8.31735 22.6376H11.9871L12.2966 20.4889H13.1407L15.5345 2.3631H10.3876L7.94538 20.4889Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.0066 13.6265L12.6977 15.7998L11.1689 15.8L11.4982 13.6266L13.0066 13.6265Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.5784 9.33398L13.2695 11.5073L11.7407 11.5075L12.07 9.33414L13.5784 9.33398Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.3787 18.3076L12.0698 20.481L10.541 20.4811L10.8703 18.3078L12.3787 18.3076Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.946 13.6265L10.6372 15.7998L9.1084 15.8L9.43765 13.6266L10.946 13.6265Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5061 9.33398L11.1972 11.5073L9.66846 11.5075L9.99771 9.33414L11.5061 9.33398Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.3757 18.3076L10.0669 20.481L8.53809 20.4811L8.86734 18.3078L10.3757 18.3076Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.22607 20.481L14.3227 20.481L14.3227 21.9102L5.22607 21.9102L5.22607 20.481Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.83887 15.7998L14.9116 15.7998L14.9116 17.2435L5.83887 17.2435L5.83887 15.7998Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.40137 11.3486L15.9369 11.3486L15.9369 12.7923L6.40137 12.7923L6.40137 11.3486Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.8472 11.3096L17.0453 18.7612L15.8607 18.9093L14.6626 11.4576L15.8472 11.3096Z"
          fill={color}
        />
        <ellipse cx="17.0453" cy="21.6449" rx="1.7284" ry="2.25088" fill={color} />
      </svg>
    </SvgIcon>
  );
};

export default IconCart;
