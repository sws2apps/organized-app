import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDrawShape = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-draw-shape ${className}`}
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
          id="mask0_4944_2981213"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2981213)">
          <path
            d="M15.25 21.7505V19.3466L8.05768 15.7504H3.25V10.2505H7.41538L10.25 6.99661V2.25049H15.75V7.75044H11.5846L8.74995 11.0043V14.4043L15.25 17.6543V16.2505H20.75V21.7504L15.25 21.7505ZM11.75 6.25046H14.25V3.75041H11.75V6.25046ZM4.74995 14.2505H7.25V11.7504H4.74995V14.2505ZM16.75 20.2505H19.25V17.7504H16.75V20.2505Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDrawShape;
