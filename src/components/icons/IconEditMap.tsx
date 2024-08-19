import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconEditMap = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-edit-map ${className}`}
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
          id="mask0_4921_2972119"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4921_2972119)">
          <path
            d="M15.7332 8.36478L20.3266 3.26057L21.8872 4.66502L17.2937 9.7692L15.8112 9.84727L15.7332 8.36478Z"
            fill={color}
          />
          <path
            d="M23.1388 3.27419L22.5494 3.92917L20.9888 2.52473L21.5783 1.86977C21.7153 1.71747 21.8883 1.63101 22.0971 1.6104C22.3059 1.58978 22.4831 1.64495 22.6286 1.77593L23.1219 2.21983C23.2674 2.3508 23.3409 2.52121 23.3423 2.73104C23.3437 2.94086 23.2759 3.12191 23.1388 3.27419Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.8042 11.4286V17.781L12.5542 18.858V7.15796L14.8049 6.30827L17.3042 5.28817V5.00031C17.3042 4.69517 17.1785 4.45767 16.9272 4.28781C16.6759 4.11794 16.4029 4.09006 16.108 4.20416L11.8042 5.86953L5.80417 3.76953L0.908049 5.43491C0.717032 5.50542 0.568641 5.61921 0.462874 5.77626C0.357091 5.93331 0.304199 6.11055 0.304199 6.30798V19.4233C0.304199 19.7348 0.429841 19.9803 0.681124 20.1598C0.932407 20.3393 1.20548 20.372 1.50035 20.2579L5.80417 18.5925L11.8042 20.6925L16.6618 19.0656C16.8593 18.9951 17.0157 18.8829 17.1311 18.7291C17.2465 18.5752 17.3042 18.3964 17.3042 18.1926V11.3644L15.8042 11.4286ZM11.0542 7.15796V18.858L6.55415 17.2849V5.58488L11.0542 7.15796ZM5.0542 17.2849L1.80417 18.531V6.68103L5.0542 5.58488V17.2849Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconEditMap;
