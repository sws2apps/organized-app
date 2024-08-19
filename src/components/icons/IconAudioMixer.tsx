import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconAudioMixer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-audio-mixer ${className}`}
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
          id="mask0_4432_164534"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164534)">
          <path
            d="M5.17334 19.7504V12.6927H3.17334V11.1928H8.67329V12.6927H6.67329V19.7504H5.17334ZM5.17334 8.80814V4.25049H6.67329V8.80814H5.17334ZM9.25026 8.80814V7.30819H11.2503V4.25049H12.7502V7.30819H14.7502V8.80814H9.25026ZM11.2503 19.7504V11.1928H12.7502V19.7504H11.2503ZM17.3272 19.7504V16.6927H15.3272V15.1928H20.8271V16.6927H18.8271V19.7504H17.3272ZM17.3272 12.8081V4.25049H18.8271V12.8081H17.3272Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAudioMixer;
