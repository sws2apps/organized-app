import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLanguage = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-language" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_22725"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_22725)">
          <path
            d="M11.919 21.731L16.1228 10.6541H18.0498L22.2536 21.731H20.3267L19.3536 18.9118H14.869L13.8652 21.731H11.919ZM15.4305 17.2964H18.7421L17.1267 12.731H17.0459L15.4305 17.2964ZM4.63443 18.9618L3.33061 17.6579L7.99596 12.9926C7.41391 12.3503 6.90462 11.683 6.46808 10.9907C6.03155 10.2984 5.65111 9.5708 5.32676 8.80798H7.25366C7.53443 9.3631 7.83122 9.86149 8.14403 10.3032C8.45685 10.7448 8.83569 11.2131 9.28056 11.708C9.96261 10.9657 10.5277 10.2073 10.9758 9.43296C11.4238 8.65861 11.7985 7.8349 12.0998 6.96183H1.86523V5.11568H8.32674V3.26953H10.1729V5.11568H16.6344V6.96183H13.9459C13.6216 8.049 13.1834 9.10765 12.6315 10.1378C12.0796 11.1679 11.3972 12.1362 10.5844 13.0426L12.7921 15.3002L12.0998 17.1964L9.24981 14.3464L4.63443 18.9618Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLanguage;
