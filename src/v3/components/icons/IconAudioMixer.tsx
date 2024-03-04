import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAudioMixer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-audio-mixer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4432_164534"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164534)">
          <path
            d="M5.17334 20.2504V13.1927H3.17334V11.6928H8.67329V13.1927H6.67329V20.2504H5.17334ZM5.17334 9.30814V4.75049H6.67329V9.30814H5.17334ZM9.25026 9.30814V7.80819H11.2503V4.75049H12.7502V7.80819H14.7502V9.30814H9.25026ZM11.2503 20.2504V11.6928H12.7502V20.2504H11.2503ZM17.3272 20.2504V17.1927H15.3272V15.6928H20.8271V17.1927H18.8271V20.2504H17.3272ZM17.3272 13.3081V4.75049H18.8271V13.3081H17.3272Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAudioMixer;
