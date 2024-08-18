import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLiterature = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-literature ${className}`}
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
          id="mask0_4909_2969360"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4909_2969360)">
          <path
            d="M2.25 19.6927V18.1927H21.75V19.6927H2.25ZM4.4231 15.8081V8.30811H5.92308V15.8081H4.4231ZM8.30772 15.8081V4.30811H9.80768V15.8081H8.30772ZM12.1923 15.8081V4.30811H13.6923V15.8081H12.1923ZM18.8462 15.8081L15.0962 9.2504L16.4038 8.5004L20.1538 15.0581L18.8462 15.8081Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLiterature;
