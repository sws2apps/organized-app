import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconInformationBoard = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-information-board" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3865_1882"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3865_1882)">
          <path
            d="M4.3077 21.0004C3.80257 21.0004 3.375 20.8254 3.025 20.4754C2.675 20.1254 2.5 19.6979 2.5 19.1927V5.80819C2.5 5.30306 2.675 4.87549 3.025 4.52549C3.375 4.17549 3.80257 4.00049 4.3077 4.00049H19.6923C20.1974 4.00049 20.625 4.17549 20.975 4.52549C21.325 4.87549 21.5 5.30306 21.5 5.80819V19.1927C21.5 19.6979 21.325 20.1254 20.975 20.4754C20.625 20.8254 20.1974 21.0004 19.6923 21.0004H4.3077ZM4.3077 19.5005H19.6923C19.7692 19.5005 19.8397 19.4684 19.9038 19.4043C19.9679 19.3402 20 19.2697 20 19.1927V5.80819C20 5.73126 19.9679 5.66073 19.9038 5.59661C19.8397 5.53251 19.7692 5.50046 19.6923 5.50046H4.3077C4.23077 5.50046 4.16024 5.53251 4.09613 5.59661C4.03202 5.66073 3.99998 5.73126 3.99998 5.80819V19.1927C3.99998 19.2697 4.03202 19.3402 4.09613 19.4043C4.16024 19.4684 4.23077 19.5005 4.3077 19.5005ZM6.38463 17.1158H17.6153V15.6159H6.38463V17.1158ZM6.38463 13.2504H10.0769V7.88511H6.38463V13.2504ZM12.2692 13.2504H17.6153V11.7505H12.2692V13.2504ZM12.2692 9.38506H17.6153V7.88511H12.2692V9.38506Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconInformationBoard;
