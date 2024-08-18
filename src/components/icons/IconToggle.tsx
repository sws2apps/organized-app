import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconToggle = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-toggle ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
      >
        <ellipse cx="9.31666" cy="9" rx="9.00001" ry="9" fill={color} />
      </svg>
    </SvgIcon>
  );
};

export default IconToggle;
