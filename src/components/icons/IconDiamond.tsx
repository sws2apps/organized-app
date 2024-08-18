import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDiamond = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-diamond ${className}`}
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
          id="mask0_2513_2687"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2687)">
          <path
            d="M12.0002 20.6062L2.29834 8.96199L6.15409 3.25049H17.8464L21.7021 8.96199L12.0002 20.6062ZM9.22136 8.25049H14.7791L13.0291 4.75044H10.9714L9.22136 8.25049ZM11.2503 17.3678V9.75044H4.92136L11.2503 17.3678ZM12.7502 17.3678L19.0791 9.75044H12.7502V17.3678ZM16.4464 8.25049H19.6541L16.9041 4.75044H14.6964L16.4464 8.25049ZM4.34636 8.25049H7.55409L9.30411 4.75044H7.09639L4.34636 8.25049Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDiamond;
