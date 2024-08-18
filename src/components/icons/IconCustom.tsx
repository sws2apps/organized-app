import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCustom = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-custom ${className}`}
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
          id="mask0_2799_54678"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54678)">
          <path
            d="M2 24.0004V22.0004H22V24.0004H2ZM6.10781 16.7313H6.97742L15.7774 7.9371L15.3404 7.48121L14.902 7.05829L6.10781 15.8583V16.7313ZM5 17.8274V15.3274L16.2192 4.11388C16.3256 4.00746 16.442 3.9299 16.5683 3.88118C16.6946 3.83246 16.8232 3.80811 16.9542 3.80811C17.0852 3.80811 17.2122 3.83246 17.335 3.88118C17.4578 3.9299 17.5744 4.00939 17.6846 4.11965L18.7135 5.15428C18.8237 5.26068 18.9022 5.37583 18.949 5.49973C18.9958 5.62363 19.0192 5.75166 19.0192 5.88381C19.0192 6.00771 18.9949 6.13381 18.9461 6.26213C18.8974 6.39045 18.8198 6.50771 18.7135 6.61391L7.5 17.8274H5ZM15.7774 7.9371L15.3404 7.48121L14.902 7.05829L15.7774 7.9371Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCustom;
