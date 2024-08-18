import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMapOverview = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-map-overview ${className}`}
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
          id="mask0_4944_2979466"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="4"
          y="4"
          width="16"
          height="16"
        >
          <rect
            x="4.99414"
            y="4.99854"
            width="14.9814"
            height="14.9814"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask0_4944_2979466)">
          <path
            d="M14.3574 18.238L10.612 16.9272L7.75413 18.0396C7.50624 18.1377 7.2752 18.11 7.06102 17.9563C6.84684 17.8026 6.73975 17.5929 6.73975 17.3271V8.58797C6.73975 8.42536 6.78685 8.28083 6.88106 8.15439C6.97525 8.02797 7.10242 7.93501 7.26255 7.87554L10.612 6.74072L14.3574 8.0516L17.2152 6.9392C17.4631 6.84104 17.6942 6.8688 17.9083 7.02248C18.1225 7.17616 18.2296 7.38587 18.2296 7.65163V16.3908C18.2296 16.5534 18.1825 16.6979 18.0883 16.8244C17.9941 16.9508 17.8669 17.0438 17.7068 17.1032L14.3574 18.238ZM13.7331 16.5258V9.32686L11.2362 8.45295V15.6519L13.7331 16.5258ZM14.9816 16.5258L16.8095 15.9203V8.62392L14.9816 9.32686V16.5258ZM8.15988 16.3548L9.98777 15.6519V8.45295L8.15988 9.05851V16.3548Z"
            fill={color}
          />
        </g>
        <mask
          id="mask1_4944_2979466"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask1_4944_2979466)">
          <path
            d="M4.36232 22.2651C3.79026 22.2651 3.3126 22.0735 2.92936 21.6903C2.54611 21.307 2.35449 20.8294 2.35449 20.2573V16.0504H3.59744V20.2573C3.59744 20.4485 3.67712 20.6238 3.83646 20.7832C3.99583 20.9425 4.17112 21.0222 4.36232 21.0222H8.56924V22.2651H4.36232ZM16.0269 22.2651V21.0222H20.2339C20.4251 21.0222 20.6004 20.9425 20.7597 20.7832C20.9191 20.6238 20.9987 20.4485 20.9987 20.2573V16.0504H22.2417V20.2573C22.2417 20.8294 22.0501 21.307 21.6668 21.6903C21.2836 22.0735 20.8059 22.2651 20.2339 22.2651H16.0269ZM2.35449 8.59268V4.38576C2.35449 3.81369 2.54611 3.33604 2.92936 2.95279C3.3126 2.56955 3.79026 2.37793 4.36232 2.37793H8.56924V3.62088H4.36232C4.17112 3.62088 3.99583 3.70055 3.83646 3.8599C3.67712 4.01927 3.59744 4.19455 3.59744 4.38576V8.59268H2.35449ZM20.9987 8.59268V4.38576C20.9987 4.19455 20.9191 4.01927 20.7597 3.8599C20.6004 3.70055 20.4251 3.62088 20.2339 3.62088H16.0269V2.37793H20.2339C20.8059 2.37793 21.2836 2.56955 21.6668 2.95279C22.0501 3.33604 22.2417 3.81369 22.2417 4.38576V8.59268H20.9987Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMapOverview;
