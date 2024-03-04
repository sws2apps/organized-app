import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAssignmetHistory = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-assignmet-history" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2557_86002"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2557_86002)"></g>
        <mask
          id="mask1_2557_86002"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="-2"
          y="0"
          width="24"
          height="25"
        >
          <rect x="-2" y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask1_2557_86002)">
          <path
            d="M18.5 10.5004H17V5.80808C17 5.73115 16.9679 5.66062 16.9038 5.59651C16.8397 5.53241 16.7692 5.50036 16.6922 5.50036H14.5V8.11571H5.5V5.50036H3.3077C3.23077 5.50036 3.16024 5.53241 3.09612 5.59651C3.03202 5.66062 2.99997 5.73115 2.99997 5.80808V19.1926C2.99997 19.2696 3.03202 19.3401 3.09612 19.4042C3.16024 19.4683 3.23077 19.5004 3.3077 19.5004H8.99997V21.0003H3.3077C2.80898 21.0003 2.38302 20.8237 2.02982 20.4705C1.67661 20.1173 1.5 19.6913 1.5 19.1926V5.80808C1.5 5.30936 1.67661 4.8834 2.02982 4.5302C2.38302 4.17699 2.80898 4.00038 3.3077 4.00038H7.71348C7.85194 3.51321 8.13495 3.10938 8.5625 2.78888C8.99005 2.46836 9.46921 2.30811 9.99998 2.30811C10.5512 2.30811 11.0381 2.46836 11.4605 2.78888C11.883 3.10938 12.1634 3.51321 12.3019 4.00038H16.6922C17.191 4.00038 17.6169 4.17699 17.9701 4.5302C18.3233 4.8834 18.5 5.30936 18.5 5.80808V10.5004ZM9.99998 5.61576C10.2577 5.61576 10.4727 5.52954 10.6452 5.35711C10.8176 5.18467 10.9038 4.9696 10.9038 4.71191C10.9038 4.45422 10.8176 4.23916 10.6452 4.06673C10.4727 3.8943 10.2577 3.80808 9.99998 3.80808C9.74229 3.80808 9.52723 3.8943 9.3548 4.06673C9.18235 4.23916 9.09613 4.45422 9.09613 4.71191C9.09613 4.9696 9.18235 5.18467 9.3548 5.35711C9.52723 5.52954 9.74229 5.61576 9.99998 5.61576Z"
            fill={color}
          />
          <mask
            id="mask2_2557_86002"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="8"
            y="9"
            width="14"
            height="15"
          >
            <rect x="8" y="9.50049" width="13.8765" height="13.8765" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask2_2557_86002)">
            <path
              d="M19.3158 21.9531L15.616 18.2533C15.3324 18.4628 15.004 18.6296 14.6309 18.7536C14.2578 18.8776 13.8565 18.9396 13.4271 18.9396C12.3277 18.9396 11.3952 18.5568 10.6295 17.7911C9.8638 17.0254 9.48096 16.0929 9.48096 14.9935C9.48096 13.8941 9.8638 12.9616 10.6295 12.1959C11.3952 11.4302 12.3277 11.0474 13.4271 11.0474C14.5265 11.0474 15.459 11.4302 16.2247 12.1959C16.9904 12.9616 17.3732 13.8941 17.3732 14.9935C17.3732 15.4284 17.3112 15.8297 17.1872 16.1973C17.0632 16.565 16.8964 16.8879 16.6869 17.1661L20.3949 20.8822L19.3158 21.9531ZM13.4271 17.4074C14.1008 17.4074 14.6716 17.1735 15.1393 16.7057C15.6071 16.238 15.841 15.6672 15.841 14.9935C15.841 14.3198 15.6071 13.749 15.1393 13.2813C14.6716 12.8135 14.1008 12.5796 13.4271 12.5796C12.7534 12.5796 12.1826 12.8135 11.7149 13.2813C11.2471 13.749 11.0132 14.3198 11.0132 14.9935C11.0132 15.6672 11.2471 16.238 11.7149 16.7057C12.1826 17.1735 12.7534 17.4074 13.4271 17.4074Z"
              fill={color}
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAssignmetHistory;
