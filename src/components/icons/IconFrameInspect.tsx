import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFrameInspect = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-frame-inspect ${className}`}
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        ...sx,
      }}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M517.08-442.92q29.07-29.08 29.07-70.93 0-41.84-29.07-70.92-29.08-29.08-70.93-29.08-41.84 0-70.92 29.08t-29.08 70.92q0 41.85 29.08 70.93 29.08 29.07 70.92 29.07 41.85 0 70.93-29.07Zm126.3 169.07L535.69-381.92q-20 14.15-42.69 21.11-22.69 6.96-46.85 6.96-66.77 0-113.38-46.61-46.62-46.62-46.62-113.39 0-66.77 46.62-113.38 46.61-46.62 113.38-46.62t113.39 46.62q46.61 46.61 46.61 113.38 0 24.16-7.27 46.85t-21.42 42.69L686.15-316l-42.77 42.15ZM212.31-140Q182-140 161-161q-21-21-21-51.31V-360h60v147.69q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H360v60H212.31ZM600-140v-60h147.69q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-360h60v147.69Q820-182 799-161q-21 21-51.31 21H600ZM140-600v-147.69Q140-778 161-799q21-21 51.31-21H360v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46V-600h-60Zm620 0v-147.69q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H600v-60h147.69Q778-820 799-799q21 21 21 51.31V-600h-60Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFrameInspect;
