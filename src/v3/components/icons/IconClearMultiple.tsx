import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconClearMultiple = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-clear-multiple" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3251_160506"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3251_160506)">
          <path
            d="M11.6499 13.6447L13.7499 11.5447L15.8499 13.6447L16.8941 12.6005L14.7941 10.5005L16.8941 8.40046L15.8499 7.35626L13.7499 9.45626L11.6499 7.35626L10.6057 8.40046L12.7057 10.5005L10.6057 12.6005L11.6499 13.6447ZM8.05765 18.0004C7.55252 18.0004 7.12496 17.8254 6.77498 17.4754C6.42498 17.1254 6.24998 16.6979 6.24998 16.1927V4.80819C6.24998 4.30306 6.42498 3.87549 6.77498 3.52549C7.12496 3.17549 7.55252 3.00049 8.05765 3.00049H19.4422C19.9473 3.00049 20.3749 3.17549 20.7249 3.52549C21.0749 3.87549 21.2499 4.30306 21.2499 4.80819V16.1927C21.2499 16.6979 21.0749 17.1254 20.7249 17.4754C20.3749 17.8254 19.9473 18.0004 19.4422 18.0004H8.05765ZM8.05765 16.5005H19.4422C19.5191 16.5005 19.5897 16.4684 19.6538 16.4043C19.7179 16.3402 19.7499 16.2697 19.7499 16.1927V4.80819C19.7499 4.73126 19.7179 4.66073 19.6538 4.59661C19.5897 4.53251 19.5191 4.50046 19.4422 4.50046H8.05765C7.98072 4.50046 7.9102 4.53251 7.8461 4.59661C7.78198 4.66073 7.74993 4.73126 7.74993 4.80819V16.1927C7.74993 16.2697 7.78198 16.3402 7.8461 16.4043C7.9102 16.4684 7.98072 16.5005 8.05765 16.5005ZM4.55768 21.5004C4.05256 21.5004 3.625 21.3254 3.275 20.9754C2.925 20.6254 2.75 20.1978 2.75 19.6927V6.80819H4.24998V19.6927C4.24998 19.7696 4.28202 19.8402 4.34613 19.9043C4.41024 19.9684 4.48076 20.0004 4.55768 20.0004H17.4422V21.5004H4.55768Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconClearMultiple;
