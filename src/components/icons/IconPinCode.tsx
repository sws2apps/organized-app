import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPinCode = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-pin-code ${className}`}
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
          id="mask0_5076_169482"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5076_169482)">
          <path
            d="M2.24996 18.7503V17.2504H21.75V18.7503H2.24996ZM3.09226 12.7388L2.06151 12.1427L2.96921 10.5465H1.15381V9.35421H2.96921L2.06151 7.80806L3.09226 7.21191L3.99996 8.75809L4.90766 7.21191L5.93841 7.80806L5.03071 9.35421H6.84611V10.5465H5.03071L5.93841 12.1427L4.90766 12.7388L3.99996 11.1426L3.09226 12.7388ZM11.0923 12.7388L10.0615 12.1427L10.9692 10.5465H9.15381V9.35421H10.9692L10.0615 7.80806L11.0923 7.21191L12 8.75809L12.9077 7.21191L13.9384 7.80806L13.0307 9.35421H14.8461V10.5465H13.0307L13.9384 12.1427L12.9077 12.7388L12 11.1426L11.0923 12.7388ZM19.0923 12.7388L18.0615 12.1427L18.9692 10.5465H17.1538V9.35421H18.9692L18.0615 7.80806L19.0923 7.21191L20 8.75809L20.9077 7.21191L21.9384 7.80806L21.0307 9.35421H22.8461V10.5465H21.0307L21.9384 12.1427L20.9077 12.7388L20 11.1426L19.0923 12.7388Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPinCode;
