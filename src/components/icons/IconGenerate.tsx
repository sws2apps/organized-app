import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconGenerate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-generate ${className}`}
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
          id="mask0_3204_169119"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3204_169119)">
          <path
            d="M10.5501 18.2006L15.7251 12.0006H11.7251L12.4501 6.32562L7.82515 13.0006H11.3001L10.5501 18.2006ZM8.57712 21.4429L9.57712 14.5006H4.95215L13.1925 2.60645H14.4232L13.4328 10.5006H18.9328L9.80782 21.4429H8.57712Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconGenerate;
