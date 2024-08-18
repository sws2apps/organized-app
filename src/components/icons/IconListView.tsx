import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconListView = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-list-view ${className}`}
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
          id="mask0_2982_68633"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2982_68633)">
          <path
            d="M3.5 21.5004V20.3081H6V19.2504H4.5V18.0581H6V17.0004H3.5V15.8081H6.34615C6.5859 15.8081 6.78686 15.8892 6.94903 16.0514C7.11121 16.2136 7.1923 16.4145 7.1923 16.6543V17.8466C7.1923 18.0863 7.11121 18.2873 6.94903 18.4495C6.78686 18.6117 6.5859 18.6927 6.34615 18.6927C6.5859 18.6927 6.78686 18.7738 6.94903 18.936C7.11121 19.0982 7.1923 19.2992 7.1923 19.5389V20.6543C7.1923 20.894 7.11121 21.095 6.94903 21.2572C6.78686 21.4193 6.5859 21.5004 6.34615 21.5004H3.5ZM3.5 14.8466V12.2505C3.5 12.0107 3.58109 11.8098 3.74327 11.6476C3.90546 11.4854 4.10642 11.4043 4.34615 11.4043H6V10.3466H3.5V9.15431H6.34615C6.5859 9.15431 6.78686 9.23541 6.94903 9.39759C7.11121 9.55977 7.1923 9.76073 7.1923 10.0005V11.7505C7.1923 11.9902 7.11121 12.1912 6.94903 12.3533C6.78686 12.5155 6.5859 12.5966 6.34615 12.5966H4.6923V13.6543H7.1923V14.8466H3.5ZM5 8.19279V3.69279H3.5V2.50049H6.1923V8.19279H5ZM9.3077 18.7504V17.2505H20.5V18.7504H9.3077ZM9.3077 12.7504V11.2505H20.5V12.7504H9.3077ZM9.3077 6.75044V5.25049H20.5V6.75044H9.3077Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconListView;
