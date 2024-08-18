import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconResizeHandle = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-resize-handle ${className}`}
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
          id="mask0_4274_140267"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4274_140267)">
          <path
            d="M6.96395 17.5709L5.90332 16.5103L16.5099 5.90369L17.5705 6.96431L6.96395 17.5709Z"
            fill={color}
          />
          <path
            d="M11.0337 17.0366L12.0943 18.0972L18.0969 12.0947L17.0362 11.0341L11.0337 17.0366Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconResizeHandle;
