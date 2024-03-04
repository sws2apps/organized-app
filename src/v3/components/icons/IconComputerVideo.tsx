import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconComputerVideo = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-computer-video" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4432_164533"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164533)">
          <path d="M15.5042 11.5042L9.21582 15.5427V7.46582L15.5042 11.5042Z" fill={color} />
          <path
            d="M8.5 21.0004V19.0004H4.3077C3.80257 19.0004 3.375 18.8254 3.025 18.4754C2.675 18.1254 2.5 17.6979 2.5 17.1927V5.80819C2.5 5.30306 2.675 4.87549 3.025 4.52549C3.375 4.17549 3.80257 4.00049 4.3077 4.00049H19.6923C20.1974 4.00049 20.625 4.17549 20.975 4.52549C21.325 4.87549 21.5 5.30306 21.5 5.80819V17.1927C21.5 17.6979 21.325 18.1254 20.975 18.4754C20.625 18.8254 20.1974 19.0004 19.6923 19.0004H15.5V21.0004H8.5ZM4.3077 17.5005H19.6923C19.7692 17.5005 19.8397 17.4684 19.9038 17.4043C19.9679 17.3402 20 17.2697 20 17.1927V5.80819C20 5.73126 19.9679 5.66073 19.9038 5.59661C19.8397 5.53251 19.7692 5.50046 19.6923 5.50046H4.3077C4.23077 5.50046 4.16024 5.53251 4.09613 5.59661C4.03202 5.66073 3.99998 5.73126 3.99998 5.80819V17.1927C3.99998 17.2697 4.03202 17.3402 4.09613 17.4043C4.16024 17.4684 4.23077 17.5005 4.3077 17.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconComputerVideo;
