import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPrint = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-print ${className}`}
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
          id="mask0_2473_21948"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21948)">
          <path
            d="M16 8.30808V5.30808H8.00005V8.30808H6.50007V3.80811H17.5V8.30808H16ZM17.8077 12.308C18.0911 12.308 18.3286 12.2122 18.5202 12.0205C18.7119 11.8289 18.8077 11.5914 18.8077 11.308C18.8077 11.0247 18.7119 10.7872 18.5202 10.5955C18.3286 10.4039 18.0911 10.308 17.8077 10.308C17.5244 10.308 17.2869 10.4039 17.0952 10.5955C16.9036 10.7872 16.8077 11.0247 16.8077 11.308C16.8077 11.5914 16.9036 11.8289 17.0952 12.0205C17.2869 12.2122 17.5244 12.308 17.8077 12.308ZM16 19.0004V14.7311H8.00005V19.0004H16ZM17.5 20.5003H6.50007V16.5003H2.78857V10.808C2.78857 10.0997 3.03056 9.50597 3.51452 9.02681C3.99849 8.54766 4.58982 8.30808 5.28852 8.30808H18.7116C19.4199 8.30808 20.0136 8.54766 20.4928 9.02681C20.972 9.50597 21.2115 10.0997 21.2115 10.808V16.5003H17.5V20.5003ZM19.7116 15.0004V10.808C19.7116 10.5247 19.6157 10.2872 19.4241 10.0955C19.2324 9.90386 18.9949 9.80803 18.7116 9.80803H5.28852C5.00519 9.80803 4.76769 9.90386 4.57602 10.0955C4.38436 10.2872 4.28852 10.5247 4.28852 10.808V15.0004H6.50007V13.2311H17.5V15.0004H19.7116Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPrint;
