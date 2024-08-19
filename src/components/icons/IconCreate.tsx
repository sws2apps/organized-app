import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCreate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-create ${className}`}
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
          id="mask0_2473_21947"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21947)">
          <path
            d="M8.95382 11.3542L11.1711 9.12153L9.4442 7.37921L8.31535 8.50806L7.26153 7.45423L8.375 6.32538L6.8365 4.78688L4.6038 7.01958L8.95382 11.3542ZM16.9711 19.3869L19.2038 17.1542L17.6653 15.6157L16.5365 16.7292L15.4827 15.6754L16.5961 14.5465L14.8634 12.8292L12.6461 15.0465L16.9711 19.3869ZM7.2019 20.5003H3.5V16.7984L7.88462 12.4138L2.5 7.01958L6.8365 2.68311L12.2557 8.0927L16.3769 3.95616C16.532 3.80102 16.7026 3.68628 16.8885 3.61193C17.0743 3.53756 17.2686 3.50038 17.4711 3.50038C17.6737 3.50038 17.8679 3.53756 18.0538 3.61193C18.2397 3.68628 18.4102 3.80102 18.5653 3.95616L20.0442 5.47923C20.1993 5.63436 20.3125 5.80487 20.3836 5.99076C20.4548 6.17666 20.4903 6.37089 20.4903 6.57346C20.4903 6.77601 20.4548 6.96606 20.3836 7.14363C20.3125 7.32118 20.1993 7.48752 20.0442 7.64266L15.9422 11.7696L21.3172 17.1638L16.9808 21.5003L11.5865 16.1157L7.2019 20.5003ZM4.99997 19.0004H6.56345L16.3731 9.20613L14.7942 7.62726L4.99997 17.4369V19.0004ZM15.5961 8.41958L14.7942 7.62726L16.3731 9.20613L15.5961 8.41958Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCreate;
