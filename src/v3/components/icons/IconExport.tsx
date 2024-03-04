import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconExport = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-export" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2450_16397"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2450_16397)">
          <path
            d="M6.92332 22.0004C5.67717 22.0004 4.61563 21.5636 3.73871 20.6899C2.8618 19.8161 2.42334 18.7562 2.42334 17.5101C2.42334 16.5793 2.67398 15.7485 3.17526 15.0178C3.67655 14.287 4.32719 13.7492 5.12719 13.4043H2.50024V11.9043H7.76944V17.1735H6.26946V14.5754C5.5887 14.7216 5.02747 15.0671 4.58579 15.612C4.14412 16.1568 3.92329 16.7863 3.92329 17.5004C3.92329 18.3376 4.21656 19.0469 4.80311 19.6283C5.38965 20.2098 6.09638 20.5005 6.92332 20.5005V22.0004ZM9.96174 21.0004V19.5005H18.6925C18.7694 19.5005 18.8399 19.4684 18.9041 19.4043C18.9682 19.3402 19.0002 19.2697 19.0002 19.1927V5.80819C19.0002 5.73126 18.9682 5.66073 18.9041 5.59661C18.8399 5.53251 18.7694 5.50046 18.6925 5.50046H5.30794C5.23101 5.50046 5.16048 5.53251 5.09636 5.59661C5.03226 5.66073 5.00021 5.73126 5.00021 5.80819V9.71201H3.50024V5.80819C3.50024 5.30306 3.67524 4.87549 4.02524 4.52549C4.37524 4.17549 4.80281 4.00049 5.30794 4.00049H18.6925C19.1976 4.00049 19.6252 4.17549 19.9752 4.52549C20.3252 4.87549 20.5002 5.30306 20.5002 5.80819V19.1927C20.5002 19.6979 20.3252 20.1254 19.9752 20.4754C19.6252 20.8254 19.1976 21.0004 18.6925 21.0004H9.96174ZM9.96174 13.2504H16.7502V11.7505H9.96174V13.2504ZM9.96174 17.2504H13.7502V15.7505H9.96174V17.2504ZM7.25024 9.25044H16.7502V7.75049H7.25024V9.25044Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconExport;
