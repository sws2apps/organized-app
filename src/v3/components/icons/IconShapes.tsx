import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconShapes = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-shapes" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2979484"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979484)">
          <path
            d="M8.38446 18.4695C8.50624 18.4798 8.62498 18.4875 8.74068 18.4926C8.85638 18.4977 8.98123 18.5003 9.11521 18.5003C9.25623 18.5003 9.38763 18.4977 9.50943 18.4926C9.63122 18.4875 9.75621 18.4798 9.88441 18.4695V20.0772C9.88441 20.1669 9.91326 20.2407 9.97096 20.2983C10.0287 20.356 10.1024 20.3849 10.1921 20.3849H19.5767C19.6665 20.3849 19.7402 20.356 19.7979 20.2983C19.8556 20.2407 19.8844 20.1669 19.8844 20.0772V10.6926C19.8844 10.6029 19.8556 10.5291 19.7979 10.4714C19.7402 10.4137 19.6665 10.3849 19.5767 10.3849H17.969C17.9793 10.2567 17.987 10.1317 17.9921 10.0099C17.9972 9.88812 17.9998 9.75671 17.9998 9.6157C17.9998 9.48172 17.9972 9.35687 17.9921 9.24117C17.987 9.12547 17.9793 9.00673 17.969 8.88495H19.5767C20.0738 8.88495 20.4994 9.06195 20.8534 9.41595C21.2074 9.76995 21.3844 10.1955 21.3844 10.6926V20.0772C21.3844 20.5743 21.2074 20.9999 20.8534 21.3539C20.4994 21.7079 20.0738 21.8849 19.5767 21.8849H10.1921C9.69502 21.8849 9.26946 21.7079 8.91546 21.3539C8.56146 20.9999 8.38446 20.5743 8.38446 20.0772V18.4695ZM9.11703 16.1156C7.30685 16.1156 5.77068 15.4852 4.50851 14.2242C3.24633 12.9633 2.61523 11.4277 2.61523 9.61752C2.61523 7.80734 3.24571 6.27116 4.50666 5.009C5.76761 3.74681 7.30318 3.11572 9.11336 3.11572C10.9236 3.11572 12.4597 3.7462 13.7219 5.00715C14.9841 6.2681 15.6152 7.80366 15.6152 9.61385C15.6152 11.424 14.9847 12.9602 13.7238 14.2224C12.4628 15.4846 10.9272 16.1156 9.11703 16.1156ZM9.11521 14.6157C10.4985 14.6157 11.6777 14.1282 12.6527 13.1532C13.6277 12.1782 14.1152 10.999 14.1152 9.6157C14.1152 8.23237 13.6277 7.0532 12.6527 6.0782C11.6777 5.1032 10.4985 4.6157 9.11521 4.6157C7.73188 4.6157 6.55271 5.1032 5.57771 6.0782C4.60271 7.0532 4.11521 8.23237 4.11521 9.6157C4.11521 10.999 4.60271 12.1782 5.57771 13.1532C6.55271 14.1282 7.73188 14.6157 9.11521 14.6157Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconShapes;
