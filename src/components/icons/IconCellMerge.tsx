import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCellMerge = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-cell-merge ${className}`}
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
            d="M130-130v-220h60v160h160v60H130Zm480 0v-60h160v-160h60v220H610ZM287-341.23 244.23-383l67-67H90v-60h221.23l-67-67L287-618.77 425.77-480 287-341.23Zm386 0L534.23-480 673-618.77 715.77-577l-67 67H870v60H648.77l67 67L673-341.23ZM130-610v-220h220v60H190v160h-60Zm640 0v-160H610v-60h220v220h-60Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCellMerge;
