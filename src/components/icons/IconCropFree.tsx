import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCropFree = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-crop-free ${className}`}
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
            d="M212.31-140Q182-140 161-161q-21-21-21-51.31V-360h60v147.69q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H360v60H212.31ZM600-140v-60h147.69q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-360h60v147.69Q820-182 799-161q-21 21-51.31 21H600ZM140-600v-147.69Q140-778 161-799q21-21 51.31-21H360v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46V-600h-60Zm620 0v-147.69q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H600v-60h147.69Q778-820 799-799q21 21 21 51.31V-600h-60Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCropFree;
