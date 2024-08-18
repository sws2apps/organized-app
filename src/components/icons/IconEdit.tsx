import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconEdit = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-edit ${className}`}
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
          id="mask0_2538_44048"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2538_44048)">
          <path
            d="M4.99997 19.0005H6.2615L16.4981 8.76389L15.2366 7.50236L4.99997 17.7389V19.0005ZM3.5 20.5004V17.1159L16.6904 3.93126C16.8416 3.79391 17.0086 3.68778 17.1913 3.61286C17.374 3.53795 17.5656 3.50049 17.7661 3.50049C17.9666 3.50049 18.1608 3.53607 18.3488 3.60724C18.5368 3.67839 18.7032 3.79152 18.848 3.94664L20.0692 5.18316C20.2243 5.32803 20.3349 5.49473 20.4009 5.68326C20.4669 5.87178 20.5 6.0603 20.5 6.24881C20.5 6.4499 20.4656 6.6418 20.3969 6.82451C20.3283 7.00725 20.219 7.17422 20.0692 7.32544L6.88458 20.5004H3.5ZM15.8563 8.14419L15.2366 7.50236L16.4981 8.76389L15.8563 8.14419Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconEdit;
