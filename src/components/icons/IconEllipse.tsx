import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconEllipse = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-ellipse"
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
      >
        <circle cx="8" cy="8.5" r="8" fill={color} />
      </svg>
    </SvgIcon>
  );
};

export default IconEllipse;
