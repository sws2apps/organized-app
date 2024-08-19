import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPanelClose = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-panel-close ${className}`}
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
          id="mask0_4944_2980680"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980680)">
          <path
            d="M5.3077 20.5004C4.80898 20.5004 4.38302 20.3238 4.02982 19.9706C3.67661 19.6174 3.5 19.1915 3.5 18.6927V5.30819C3.5 4.80947 3.67661 4.38351 4.02982 4.03031C4.38302 3.6771 4.80898 3.50049 5.3077 3.50049H18.6923C19.191 3.50049 19.6169 3.6771 19.9701 4.03031C20.3233 4.38351 20.5 4.80947 20.5 5.30819V18.6927C20.5 19.1915 20.3233 19.6174 19.9701 19.9706C19.6169 20.3238 19.191 20.5004 18.6923 20.5004H5.3077ZM7.99998 19.0005V5.00046H5.3077C5.23077 5.00046 5.16024 5.03251 5.09612 5.09661C5.03202 5.16073 4.99997 5.23126 4.99997 5.30819V18.6927C4.99997 18.7697 5.03202 18.8402 5.09612 18.9043C5.16024 18.9684 5.23077 19.0005 5.3077 19.0005H7.99998ZM9.49995 19.0005H18.6923C18.7692 19.0005 18.8397 18.9684 18.9038 18.9043C18.9679 18.8402 19 18.7697 19 18.6927V5.30819C19 5.23126 18.9679 5.16073 18.9038 5.09661C18.8397 5.03251 18.7692 5.00046 18.6923 5.00046H9.49995V19.0005Z"
            fill={color}
          />
          <path
            d="M16.0479 15.5871V8.41406L12.4517 12.0006L16.0479 15.5871Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPanelClose;
