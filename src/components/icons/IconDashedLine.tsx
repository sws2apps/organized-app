import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDashedLine = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-dashed-line ${className}`}
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
          id="mask0_4944_2979629"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979629)">
          <path
            d="M4.58691 4.58747C4.58691 4.58747 11.4187 4.73278 15.4159 9.09343C19.4131 13.4541 19.4131 19.4136 19.4131 19.4136"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDashedLine;
