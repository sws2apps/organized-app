import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRead = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-read ${className}`}
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
          id="mask0_2538_45293"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2538_45293)">
          <path
            d="M6.6998 18.0006L1.0498 12.3506L2.4748 10.9506L8.1248 16.6006L6.6998 18.0006ZM12.3498 18.0006L6.6998 12.3506L8.0998 10.9256L12.3498 15.1756L21.5498 5.97559L22.9498 7.40059L12.3498 18.0006ZM12.3498 12.3506L10.9248 10.9506L15.8748 6.00059L17.2998 7.40059L12.3498 12.3506Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRead;
