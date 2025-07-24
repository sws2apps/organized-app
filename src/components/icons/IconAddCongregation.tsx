import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconAddCongregation = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-add-congregation ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1367 16.5908H21.7275V18.1367H18.1367V21.7275H16.5908V18.1367H13V16.5908H16.5908V13H18.1367V16.5908ZM18 8.64453V10.7041H16.5V9.39453L10.5 4.875L4.5 9.39453V18.3945H11.6904V19.8945H3V8.64453L10.5 3L18 8.64453Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconAddCongregation;
