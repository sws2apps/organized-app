import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

/** Material Symbols Outlined: note, weight 300, optical size 24. */
const IconNote = ({
  color = 'var(--black)',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => (
  <SvgIcon
    className={`organized-icon-note ${className ?? ''}`}
    viewBox="0 0 24 24"
    sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
  >
    <path
      d="M6.3 21.5q-.75 0-1.275-.525Q4.5 20.45 4.5 19.7V4.3q0-.75.525-1.275Q5.55 2.5 6.3 2.5h7.95l5.25 5.25V19.7q0 .75-.525 1.275-.525.525-1.275.525Zm7.2-13V4H6.3q-.1 0-.2.1t-.1.2v15.4q0 .1.1.2t.2.1h11.4q.1 0 .2-.1t.1-.2V8.5ZM6 4v4.5V4 20 4Z"
      fill={color}
    />
  </SvgIcon>
);

export default IconNote;
