import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconExpandAll = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-expand-all ${className}`}
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
          id="mask0_20440_350413"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_20440_350413)">
          <path
            d="M1 17V15.3636H11V17H1ZM1 12.8182V11.1818H11V12.8182H1ZM1 8.63636V7H11V8.63636L1 8.63636Z"
            fill={color}
          />
          <path
            d="M17.6939 21.8154L13.1459 17.2479L14.1997 16.1942L17.6939 19.7077L21.1784 16.1942L22.2324 17.2479L17.6939 21.8154Z"
            fill={color}
          />
          <path
            d="M17.6939 2.19434L13.1459 6.76183L14.1997 7.81558L17.6939 4.30209L21.1784 7.81559L22.2324 6.76184L17.6939 2.19434Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconExpandAll;
