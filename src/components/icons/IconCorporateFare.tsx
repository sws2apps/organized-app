import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCorporateFare = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-corporate-fare ${className}`}
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
          id="mask0_13161_343524"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343524)">
          <path
            d="M2.36548 20.5781V3.07812H11.8652V7.07812H21.6345V20.5781H2.36548ZM3.86523 19.0781H10.3655V16.5781H3.86523V19.0781ZM3.86523 15.0781H10.3655V12.5781H3.86523V15.0781ZM3.86523 11.0781H10.3655V8.57812H3.86523V11.0781ZM3.86523 7.07812H10.3655V4.57812H3.86523V7.07812ZM11.8652 19.0781H20.1347V8.57812H11.8652V19.0781ZM14.0577 12.5781V11.0781H17.75V12.5781H14.0577ZM14.0577 16.5781V15.0781H17.75V16.5781H14.0577Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCorporateFare;
