import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconUndo = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-undo ${className}`}
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
          id="mask0_2697_32275"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2697_32275)">
          <path
            d="M7.20193 18.5004V17.0005H14.3789C15.4224 17.0005 16.3205 16.6559 17.0731 15.9668C17.8256 15.2777 18.2019 14.4267 18.2019 13.4139C18.2019 12.4011 17.8256 11.5517 17.0731 10.8658C16.3205 10.1799 15.4224 9.83699 14.3789 9.83699H7.35762L10.1403 12.6197L9.08652 13.6735L4.5 9.08701L9.08652 4.50049L10.1403 5.55431L7.35762 8.33704H14.3789C15.8417 8.33704 17.0945 8.82517 18.1375 9.80144C19.1804 10.7777 19.7019 11.9819 19.7019 13.4139C19.7019 14.846 19.1804 16.0517 18.1375 17.0312C17.0945 18.0107 15.8417 18.5004 14.3789 18.5004H7.20193Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUndo;
