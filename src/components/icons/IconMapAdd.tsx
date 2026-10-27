import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

// Material's folded map with a plus cut into its corner; drawn as strokes,
// so the fill rules buttons apply to icons can't fill it in
const IconMapAdd = ({
  color = 'currentColor',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  const line = { fill: 'none', stroke: color, strokeWidth: 1.5 };

  return (
    <SvgIcon
      className={`organized-icon-map-add ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.75 11.25V3.5L13.17 5.5L7.58 3.5L2 5.5V20.5L7.58 18.5L11.25 19.81"
          style={line}
        />
        <path d="M7.58 3.5V18.5M13.17 5.5V13.5" style={line} />
        <path d="M18.75 14.25V23.25M14.25 18.75H23.25" style={line} />
      </svg>
    </SvgIcon>
  );
};

export default IconMapAdd;
